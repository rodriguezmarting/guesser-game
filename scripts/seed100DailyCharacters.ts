import { createClient } from "@supabase/supabase-js";
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

// Function to get a random character from the list
function getRandomCharacter(characters: Character[]): Character {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}

// Function to get the next available assigned number
async function getNextAssignedNumber(gameId: string): Promise<number> {
  const { data, error } = await supabase
    .from("DailyCharacterLog")
    .select("assignedNumber")
    .eq("gameId", gameId)
    .order("assignedNumber", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching max assigned number:", error);
    return 1;
  }

  return data && data.length > 0 ? data[0].assignedNumber + 1 : 1;
}

async function main() {
  console.log("Starting to seed 100 daily characters...");

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

    console.log(`Found ${characters.length} characters in the database`);

    // 3. Get the next available assigned number
    const startingNumber = await getNextAssignedNumber(game.id);
    console.log(`Starting from assigned number: ${startingNumber}`);

    // 4. Generate 100 daily character entries
    const dailyCharacters = [];
    const today = new Date();

    for (let i = 0; i < 100; i++) {
      // Generate dates starting from today and going forward
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Get a random character for this date
      const randomCharacter = getRandomCharacter(characters);

      dailyCharacters.push({
        gameId: game.id,
        characterId: randomCharacter.id,
        date: date.toISOString().split("T")[0],
        assignedNumber: startingNumber + i,
        totalGuesses: 0,
      });
    }

    console.log(`Generated ${dailyCharacters.length} daily character entries`);

    // 5. Insert daily characters (using upsert to handle conflicts)
    console.log("Inserting daily characters into database...");
    const { error: insertError } = await supabase
      .from("DailyCharacterLog")
      .upsert(dailyCharacters, {
        onConflict: "gameId,date",
        ignoreDuplicates: false,
      });

    if (insertError) {
      throw insertError;
    }

    console.log("Successfully seeded 100 daily characters!");
    console.log(
      `Added entries for dates: ${dailyCharacters[0].date} to ${dailyCharacters[99].date}`
    );
    console.log(
      `Assigned numbers: ${startingNumber} to ${startingNumber + 99}`
    );

    // 7. Show some statistics
    const characterCounts = dailyCharacters.reduce((acc, dc) => {
      const characterValue =
        characters.find((c) => c.id === dc.characterId)?.value || "unknown";
      acc[characterValue] = (acc[characterValue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("\nCharacter distribution:");
    Object.entries(characterCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([char, count]) => {
        console.log(`  ${char}: ${count} times`);
      });
  } catch (error) {
    console.error("Error during daily character seed:", error);
    process.exit(1);
  }
}

main();
