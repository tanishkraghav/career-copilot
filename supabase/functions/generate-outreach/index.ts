import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const requestSchema = z.object({
  resume_text: z.string().min(50, "Resume must be at least 50 characters").max(10000, "Resume exceeds 10000 characters"),
  job_description: z.string().min(20, "Job description must be at least 20 characters").max(5000, "Job description exceeds 5000 characters"),
  company_name: z.string().min(1, "Company name is required").max(200),
  company_website: z.string().url().max(500).optional().or(z.literal("")),
  recruiter_name: z.string().max(100).optional().or(z.literal("")),
  tone: z.enum(["professional", "confident", "friendly"]).default("professional"),
  email_length: z.enum(["short", "medium", "detailed"]).default("medium"),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await anonClient.auth.getUser(token);
    if (userError || !user) throw new Error("Unauthorized");

    // Check credits
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits_remaining, plan_type")
      .eq("user_id", user.id)
      .single();

    if (!profile) throw new Error("Profile not found");

    if (profile.plan_type === "free" && profile.credits_remaining <= 0) {
      return new Response(JSON.stringify({ error: "No credits remaining. Please upgrade to Pro." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body;
    try {
      body = requestSchema.parse(await req.json());
    } catch (validationError) {
      const message = validationError instanceof z.ZodError
        ? validationError.errors.map(e => e.message).join(", ")
        : "Invalid request data";
      return new Response(JSON.stringify({ error: message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { resume_text, job_description, company_name, company_website, recruiter_name, tone, email_length } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a top-tier Indian placement strategist helping students get internships and jobs. Write concise, confident, highly personalized outreach messages that increase response rate.

You MUST respond with a valid JSON object with these exact keys:
- cold_email: string (a personalized cold email)
- cover_letter: string (a tailored cover letter)
- linkedin_dm: string (a short LinkedIn DM)
- follow_ups: array of 2 strings (follow-up emails)
- interview_pitch: string (a 30-second interview pitch)
- reply_probability: number between 0-100 (estimated reply chance)
- improvement_suggestions: string (tips to improve their profile)

Guidelines:
- Tone: ${tone}
- Email length: ${email_length}
- Be specific, reference the candidate's actual skills and projects
- Reference the company and role specifically
- For Indian context: mention relevant tech stack, Indian companies, placement culture
- Make it sound human, not templated
- Do NOT use generic phrases like "I am writing to express my interest"`;

    const userPrompt = `Resume:
${resume_text}

Job Description:
${job_description}

Company: ${company_name}
${company_website ? `Website: ${company_website}` : ""}
${recruiter_name ? `Recruiter: ${recruiter_name}` : ""}

Generate the complete outreach pack as JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "AI rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI generation failed");
    }

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "";

    // Clean markdown code fences if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      // Fallback structure
      result = {
        cold_email: content,
        cover_letter: "Could not parse. Please regenerate.",
        linkedin_dm: "",
        follow_ups: ["", ""],
        interview_pitch: "",
        reply_probability: 50,
        improvement_suggestions: "",
      };
    }

    // Deduct credit for free users
    if (profile.plan_type === "free") {
      await supabase
        .from("profiles")
        .update({ credits_remaining: profile.credits_remaining - 1 })
        .eq("user_id", user.id);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-outreach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
