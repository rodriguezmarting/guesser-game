-- Enable RLS on the DailyCharacterLog table
ALTER TABLE "DailyCharacterLog" ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read from DailyCharacterLog
CREATE POLICY "Allow public read access to DailyCharacterLog"
ON "DailyCharacterLog"
FOR SELECT
TO public
USING (true);

-- Create a policy that allows authenticated users to update their own guesses
CREATE POLICY "Allow authenticated users to update their own guesses"
ON "DailyCharacterLog"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true); 