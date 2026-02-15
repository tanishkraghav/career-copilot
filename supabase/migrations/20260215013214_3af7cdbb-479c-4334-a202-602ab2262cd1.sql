
-- Make the payment-screenshots bucket private
UPDATE storage.buckets SET public = false WHERE id = 'payment-screenshots';

-- Add admin view policy for payment screenshots
CREATE POLICY "Admins can view all payment screenshots"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'payment-screenshots' AND has_role(auth.uid(), 'admin'::app_role));
