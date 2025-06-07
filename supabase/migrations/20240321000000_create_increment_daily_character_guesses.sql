-- Create a function to atomically increment the totalGuesses for a daily character
CREATE OR REPLACE FUNCTION increment_daily_character_guesses(
  p_game_id TEXT,
  p_character_id TEXT
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