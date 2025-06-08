console.log(`
-- Run this SQL in your Supabase SQL editor:

-- First, drop all versions of the function
DROP FUNCTION IF EXISTS increment_daily_character_guesses(TEXT, TEXT);
DROP FUNCTION IF EXISTS increment_daily_character_guesses(UUID, UUID);

-- Create a function to atomically increment the totalGuesses for a daily character
CREATE OR REPLACE FUNCTION increment_daily_character_guesses(
  p_game_id UUID,
  p_character_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the DailyCharacterLog for today's character
  UPDATE "DailyCharacterLog"
  SET 
    "totalGuesses" = "totalGuesses" + 1,
    "updatedAt" = NOW()
  WHERE 
    "gameId" = p_game_id
    AND "characterId" = p_character_id
    AND "date" = CURRENT_DATE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_daily_character_guesses(UUID, UUID) TO authenticated;
`);
