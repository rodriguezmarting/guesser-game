-- Update dates from 2025 to 2024
UPDATE "DailyCharacterLog"
SET 
  "date" = ("date" - INTERVAL '1 year')::date,
  "updatedAt" = NOW()
WHERE 
  "date" >= '2025-01-01'::date 
  AND "date" <= '2025-12-31'::date; 