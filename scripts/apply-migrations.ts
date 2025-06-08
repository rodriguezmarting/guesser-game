import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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
});

async function main() {
  try {
    console.log("Creating increment_daily_character_guesses function...");

    const { error } = await supabase.rpc(
      "create_increment_daily_character_guesses",
      {
        sql: `
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
      `,
      }
    );

    if (error) {
      throw error;
    }

    console.log(
      "Successfully created increment_daily_character_guesses function!"
    );
  } catch (error) {
    console.error("Error applying migration:", error);
    process.exit(1);
  }
}

main();
