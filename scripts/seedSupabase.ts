import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ES Module equivalent of __filename and __dirname
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
    // Explicitly stated for clarity, service_role key bypasses RLS by default
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

const GAME_NAME = "AvatarGuesser";

interface CharacterJson {
  value: string;
  label: string;
  imageUrl: string;
  gender: string;
  fightingStyle: string;
  nationality: string;
  eyeColor: string;
  skinColor: string;
  firstAppearance: string;
  quoteText: string;
  quoteAttribution: string;
  // Add any other fields that might be in your JSON that are not directly on Character table
}

async function main() {
  console.log("Starting database seed...");

  try {
    // 1. Upsert Game
    console.log(`Upserting game: ${GAME_NAME}...`);
    const { data: game, error: gameError } = await supabase
      .from("Game")
      .upsert(
        { name: GAME_NAME },
        { onConflict: "name", ignoreDuplicates: false }
      )
      .select()
      .single();

    if (gameError) throw gameError;
    if (!game) throw new Error("Failed to upsert game.");
    console.log(`Game "${game.name}" (ID: ${game.id}) upserted successfully.`);

    // 2. Define and Upsert AttributeDefinitions
    const attributeNames = [
      "Gender",
      "Fighting Style",
      "Nationality",
      "Eye Color",
      "Skin Color",
      "First Appearance",
      // Add other attribute names as defined in your Character interface/JSON
    ];

    console.log("Upserting attribute definitions...");
    const attributeDefinitions: { id: string; name: string }[] = [];
    for (const attrName of attributeNames) {
      const { data: attrDef, error: attrDefError } = await supabase
        .from("AttributeDefinition")
        .upsert(
          { gameId: game.id, name: attrName },
          { onConflict: "gameId, name", ignoreDuplicates: false } // Assumes UNIQUE("gameId", "name")
        )
        .select("id, name")
        .single();

      if (attrDefError) throw attrDefError;
      if (!attrDef) throw new Error(`Failed to upsert attribute: ${attrName}`);
      attributeDefinitions.push(attrDef);
      console.log(
        `  Attribute "${attrDef.name}" (ID: ${attrDef.id}) upserted.`
      );
    }
    const attributeDefinitionMap = new Map(
      attributeDefinitions.map((ad) => [ad.name, ad.id])
    );

    // 3. Read characters.json
    const charactersJsonPath = path.join(
      __dirname,
      "../public/data/characters.json"
    );
    console.log(`Reading characters from: ${charactersJsonPath}`);
    const charactersData: CharacterJson[] = JSON.parse(
      fs.readFileSync(charactersJsonPath, "utf-8")
    );
    console.log(`Found ${charactersData.length} characters in JSON file.`);

    // 4. Upsert Characters and their Attributes
    console.log("Upserting characters and their attributes...");
    for (const charJson of charactersData) {
      console.log(`  Processing character: ${charJson.label}...`);
      const { data: character, error: charError } = await supabase
        .from("Character")
        .upsert(
          {
            gameId: game.id,
            value: charJson.value,
            label: charJson.label,
            imageUrl: charJson.imageUrl,
            quote: charJson.quoteText,
            quoteAttribution: charJson.quoteAttribution,
          },
          { onConflict: "gameId, value", ignoreDuplicates: false }
        )
        .select("id, label")
        .single();

      if (charError) throw charError;
      if (!character)
        throw new Error(`Failed to upsert character: ${charJson.label}`);
      console.log(
        `    Character "${character.label}" (ID: ${character.id}) upserted.`
      );

      // Create CharacterAttribute entries
      for (const attrName of attributeNames) {
        const attributeDefinitionId = attributeDefinitionMap.get(attrName);

        // Convert attribute name to camelCase for JSON key lookup
        // e.g., "Fighting Style" -> "fightingStyle"
        const jsonKey = attrName
          .split(" ")
          .map((word, index) =>
            index === 0
              ? word.toLowerCase()
              : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join("");

        const characterAttributeValue = (charJson as any)[jsonKey];

        if (attributeDefinitionId && characterAttributeValue !== undefined) {
          console.log(
            `      Upserting attribute "${attrName}" with value "${characterAttributeValue}"`
          );
          const { error: charAttrError } = await supabase
            .from("CharacterAttribute")
            .upsert(
              {
                characterId: character.id,
                attributeDefinitionId: attributeDefinitionId,
                value: String(characterAttributeValue), // Ensure value is string
              },
              {
                onConflict: "characterId, attributeDefinitionId",
                ignoreDuplicates: false,
              } // Assumes UNIQUE("characterId", "attributeDefinitionId")
            );
          if (charAttrError) throw charAttrError;
        } else if (
          attributeDefinitionId &&
          characterAttributeValue === undefined
        ) {
          console.warn(
            `      Attribute "${attrName}" found in definitions but corresponding key "${jsonKey}" not found or undefined in JSON for character "${charJson.label}". Skipping.`
          );
        }
      }
    }

    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Error during database seed:", error);
    process.exit(1);
  }
}

main();
