import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

// Initialize Supabase client with service role key for full access
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log("Starting database seeding...");

  try {
    // Read character data from JSON file
    const charactersPath = join(
      process.cwd(),
      "public",
      "data",
      "characters.json"
    );
    const charactersData = JSON.parse(readFileSync(charactersPath, "utf-8"));

    // Create or update game
    const { data: game, error: gameError } = await supabase
      .from("Game")
      .upsert(
        {
          name: "AvatarGuesser",
          description: "Guess the Avatar character of the day!",
        },
        {
          onConflict: "name",
        }
      )
      .select()
      .single();

    if (gameError) {
      throw new Error(`Failed to create game: ${gameError.message}`);
    }

    console.log("Game created/updated:", game.name);

    // Create attribute definitions
    const attributeDefinitions = [
      { name: "fightingStyle", description: "Character's fighting style" },
      { name: "nationality", description: "Character's nationality" },
      { name: "bending", description: "Character's bending abilities" },
      { name: "gender", description: "Character's gender" },
      { name: "age", description: "Character's age" },
      { name: "hairColor", description: "Character's hair color" },
      { name: "eyeColor", description: "Character's eye color" },
      { name: "skinColor", description: "Character's skin color" },
      { name: "height", description: "Character's height" },
      { name: "weight", description: "Character's weight" },
      { name: "build", description: "Character's build" },
      { name: "hairLength", description: "Character's hair length" },
      { name: "hairStyle", description: "Character's hair style" },
      { name: "facialHair", description: "Character's facial hair" },
      { name: "clothing", description: "Character's clothing" },
      { name: "accessories", description: "Character's accessories" },
      { name: "weapons", description: "Character's weapons" },
      { name: "pets", description: "Character's pets" },
      { name: "occupation", description: "Character's occupation" },
      { name: "affiliation", description: "Character's affiliation" },
      { name: "relationships", description: "Character's relationships" },
      { name: "personality", description: "Character's personality" },
      { name: "skills", description: "Character's skills" },
      { name: "abilities", description: "Character's abilities" },
      { name: "weaknesses", description: "Character's weaknesses" },
      { name: "goals", description: "Character's goals" },
      { name: "backstory", description: "Character's backstory" },
      { name: "quotes", description: "Character's quotes" },
      { name: "trivia", description: "Character's trivia" },
    ];

    for (const def of attributeDefinitions) {
      const { error: defError } = await supabase
        .from("AttributeDefinition")
        .upsert(
          {
            gameId: game.id,
            ...def,
          },
          {
            onConflict: "gameId,name",
          }
        );

      if (defError) {
        throw new Error(
          `Failed to create attribute definition ${def.name}: ${defError.message}`
        );
      }
    }

    console.log("Attribute definitions created/updated");

    // Create characters and their attributes
    for (const charData of charactersData) {
      // Create character
      const { data: character, error: charError } = await supabase
        .from("Character")
        .upsert(
          {
            gameId: game.id,
            value: charData.name,
            displayName: charData.name,
            imageUrl: charData.imageUrl,
          },
          {
            onConflict: "gameId,value",
          }
        )
        .select()
        .single();

      if (charError) {
        throw new Error(
          `Failed to create character ${charData.name}: ${charError.message}`
        );
      }

      // Create character attributes
      for (const [key, value] of Object.entries(charData.attributes)) {
        if (value) {
          const { error: attrError } = await supabase
            .from("CharacterAttribute")
            .upsert(
              {
                characterId: character.id,
                attributeName: key,
                value: value.toString(),
              },
              {
                onConflict: "characterId,attributeName",
              }
            );

          if (attrError) {
            throw new Error(
              `Failed to create attribute ${key} for character ${charData.name}: ${attrError.message}`
            );
          }
        }
      }

      console.log(`Character created/updated: ${charData.name}`);
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main();
