
-- Drop the old public access policy that was never removed
DROP POLICY IF EXISTS "Anyone can view payment screenshots" ON storage.objects;

-- Allow users to view only their own payment screenshots
CREATE POLICY "Users can view own payment screenshots"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'payment-screenshots' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
