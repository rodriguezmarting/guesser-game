import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Supabase URL or Service Role Key is missing. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file."
  );
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
    },
  },
});

const GAME_NAME = "AvatarGuesser";

interface Character {
  id: string;
  value: string;
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function main() {
  console.log("Starting daily character seed...");

  try {
    // 1. Get the game ID
    const { data: game, error: gameError } = await supabase
      .from("Game")
      .select("id")
      .eq("name", GAME_NAME)
      .single();

    if (gameError || !game) {
      throw new Error(`Failed to find game "${GAME_NAME}"`);
    }

    // 2. Get all characters for this game
    const { data: characters, error: charsError } = await supabase
      .from("Character")
      .select("id, value")
      .eq("gameId", game.id);

    if (charsError || !characters) {
      throw new Error("Failed to fetch characters");
    }

    if (characters.length === 0) {
      throw new Error("No characters found in the database");
    }

    // 3. Generate dates for the next 30 days
    const today = new Date();
    const dates: Date[] = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    // 4. Shuffle characters and assign them to dates
    const typedCharacters = characters as Character[];
    const shuffledCharacters = shuffleArray(typedCharacters);
    const dailyCharacters = dates.map((date, index) => {
      const character = shuffledCharacters[index % shuffledCharacters.length];
      return {
        gameId: game.id,
        characterId: character.id,
        date: date.toISOString().split("T")[0],
        assignedNumber: index + 1,
        totalGuesses: 0,
      };
    });

    // 5. Insert daily characters
    console.log("Inserting daily characters...");
    const { error: insertError } = await supabase
      .from("DailyCharacterLog")
      .upsert(dailyCharacters, {
        onConflict: "gameId,date",
        ignoreDuplicates: false,
      });

    if (insertError) {
      throw insertError;
    }

    // 6. Update the daily-characters.json file
    const dailyCharactersJson = {
      characters: dailyCharacters.map((dc) => ({
        date: dc.date,
        number: dc.assignedNumber,
        characterId:
          typedCharacters.find((c: Character) => c.id === dc.characterId)
            ?.value || "",
        guesses: dc.totalGuesses,
      })),
      lastUpdated: new Date().toISOString(),
    };

    const outputPath = path.join(
      __dirname,
      "../public/data/daily-characters.json"
    );
    await fs.writeFile(
      outputPath,
      JSON.stringify(dailyCharactersJson, null, 2)
    );

    console.log("Successfully seeded daily characters!");
    console.log(`Updated ${dailyCharacters.length} days of characters`);
    console.log(`Data saved to ${outputPath}`);
  } catch (error) {
    console.error("Error during daily character seed:", error);
    process.exit(1);
  }
}

main();
