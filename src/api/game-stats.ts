import { createServerFn } from "@tanstack/react-start";
import { createSupabaseServerClient } from "~/lib/supabase";

export interface DailyCharacter {
  date: string;
  number: number;
  characterId: string;
  guesses: number;
}

interface DailyCharacterLog {
  date: string;
  assignedNumber: number;
  characterId: string;
  totalGuesses: number;
  character: {
    value: string;
  };
}

const GAME_NAME = "AvatarGuesser";

async function getGameId() {
  const supabase = createSupabaseServerClient();
  const { data: game, error } = await supabase
    .from("Game")
    .select("id")
    .eq("name", GAME_NAME)
    .single();

  if (error || !game) {
    throw new Error(`Failed to find game "${GAME_NAME}"`);
  }

  return game.id;
}

export const getDailyCharacter = createServerFn({
  method: "GET",
}).handler(async () => {
  const supabase = createSupabaseServerClient();
  const gameId = await getGameId();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Get daily characters for today and yesterday
  const { data: dailyChars, error } = await supabase
    .from("DailyCharacterLog")
    .select(
      `
      date,
      assignedNumber,
      characterId,
      totalGuesses,
      character:Character (
        value
      )
    `
    )
    .eq("gameId", gameId)
    .or(`date.eq.${today},date.eq.${yesterday}`)
    .returns<DailyCharacterLog[]>();

  if (error) {
    console.error("Error fetching daily characters:", error.message);
    return { today: null, yesterday: null };
  }

  const todayChar = dailyChars?.find((c) => c.date === today);
  const yesterdayChar = dailyChars?.find((c) => c.date === yesterday);

  return {
    today: todayChar
      ? {
          date: todayChar.date,
          number: todayChar.assignedNumber,
          characterId: todayChar.character.value,
          guesses: todayChar.totalGuesses,
        }
      : null,
    yesterday: yesterdayChar
      ? {
          date: yesterdayChar.date,
          number: yesterdayChar.assignedNumber,
          characterId: yesterdayChar.character.value,
          guesses: yesterdayChar.totalGuesses,
        }
      : null,
  };
});

export const getCharacterStats = createServerFn({
  method: "GET",
}).handler(async () => {
  const supabase = createSupabaseServerClient();
  const gameId = await getGameId();

  const { data: dailyChars, error } = await supabase
    .from("DailyCharacterLog")
    .select(
      `
      characterId,
      totalGuesses,
      character:Character (
        value
      )
    `
    )
    .eq("gameId", gameId)
    .returns<DailyCharacterLog[]>();

  if (error) {
    console.error("Error fetching character stats:", error.message);
    return { guesses: {} };
  }

  const guesses = dailyChars.reduce((acc, char) => {
    acc[char.character.value] = char.totalGuesses;
    return acc;
  }, {} as Record<string, number>);

  return { guesses };
});

export const incrementCharacterGuess = createServerFn({
  method: "POST",
})
  .validator((data: { characterId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const gameId = await getGameId();

    // Get the character's internal ID
    const { data: character, error: charError } = await supabase
      .from("Character")
      .select("id")
      .eq("gameId", gameId)
      .eq("value", data.characterId)
      .single();

    if (charError || !character) {
      console.error("Error finding character:", charError?.message);
      return { success: false };
    }

    // Update the daily character log
    const { error: updateError } = await supabase.rpc(
      "increment_daily_character_guesses",
      {
        p_game_id: gameId,
        p_character_id: character.id,
      }
    );

    if (updateError) {
      console.error("Error incrementing guesses:", updateError.message);
      return { success: false };
    }

    return { success: true };
  });

export const setDailyCharacter = createServerFn({
  method: "POST",
})
  .validator(
    (data: { date: string; characterId: string; number: number }) => data
  )
  .handler(async ({ data }) => {
    if (!data.date || !data.characterId || typeof data.number !== "number") {
      throw new Error("date, characterId, and number are required");
    }

    const supabase = createSupabaseServerClient();
    const gameId = await getGameId();

    // Get the character's internal ID
    const { data: character, error: charError } = await supabase
      .from("Character")
      .select("id")
      .eq("gameId", gameId)
      .eq("value", data.characterId)
      .single();

    if (charError || !character) {
      console.error("Error finding character:", charError?.message);
      return { success: false };
    }

    // Upsert the daily character log
    const { error: upsertError } = await supabase
      .from("DailyCharacterLog")
      .upsert(
        {
          gameId,
          characterId: character.id,
          date: data.date,
          assignedNumber: data.number,
          totalGuesses: 0,
        },
        {
          onConflict: "gameId,date",
          ignoreDuplicates: false,
        }
      );

    if (upsertError) {
      console.error("Error setting daily character:", upsertError.message);
      return { success: false };
    }

    return { success: true };
  });

export const initializeCharacterStats = createServerFn({
  method: "POST",
})
  .validator((data: { characterIds: string[] }) => data)
  .handler(async ({ data }) => {
    if (!Array.isArray(data.characterIds)) {
      throw new Error("characterIds must be an array");
    }

    const supabase = createSupabaseServerClient();
    const gameId = await getGameId();

    // Get the internal character IDs
    const { data: characters, error: charError } = await supabase
      .from("Character")
      .select("id")
      .eq("gameId", gameId)
      .in("value", data.characterIds);

    if (charError || !characters) {
      console.error("Error finding characters:", charError?.message);
      return { success: false };
    }

    // Initialize daily character logs
    const { error: upsertError } = await supabase
      .from("DailyCharacterLog")
      .upsert(
        characters.map((char) => ({
          gameId,
          characterId: char.id,
          totalGuesses: 0,
        })),
        {
          onConflict: "gameId,characterId",
          ignoreDuplicates: false,
        }
      );

    if (upsertError) {
      console.error("Error initializing character stats:", upsertError.message);
      return { success: false };
    }

    return { success: true };
  });
