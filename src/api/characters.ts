import { createServerFn } from "@tanstack/react-start";
// import { prisma } from "~/lib/prisma"; // Assuming ~ is src/
import { createSupabaseServerClient } from "~/lib/supabase";

export interface Character {
  value: string;
  label: string;
  imageUrl: string;
  gender: string;
  fightingStyle: string;
  nationality: string;
  eyeColor: string;
  skinColor: string;
  firstAppearance: string;
  quote: string;
  quoteAttribution: string;
}

const GAME_NAME = "AvatarGuesser";
let charactersCache: Character[] | null = null;

async function loadCharacters(): Promise<Character[]> {
  if (charactersCache) {
    // console.log("Returning characters from cache");
    return charactersCache;
  }
  // console.log("Fetching characters from Supabase");

  const supabase = createSupabaseServerClient();

  try {
    // 1. Fetch the Game
    const { data: game, error: gameError } = await supabase
      .from("Game")
      .select("id")
      .eq("name", GAME_NAME)
      .single();

    if (gameError || !game) {
      console.error(`Error fetching game "${GAME_NAME}":`, gameError);
      return [];
    }

    // 2. Fetch Attribute Definitions for this game
    const { data: attributeDefinitions, error: attrDefError } = await supabase
      .from("AttributeDefinition")
      .select("id, name")
      .eq("gameId", game.id);

    if (attrDefError || !attributeDefinitions) {
      console.error("Error fetching attribute definitions:", attrDefError);
      return [];
    }
    const attributeDefinitionMap = new Map(
      attributeDefinitions.map((ad) => [ad.id, ad.name])
    );

    // 3. Fetch Characters for this game
    const { data: charactersFromDb, error: charsError } = await supabase
      .from("Character")
      .select(
        `
        id,
        value,
        label,
        imageUrl,
        quote,
        quoteAttribution,
        CharacterAttribute ( attributeDefinitionId, value )
      `
      )
      .eq("gameId", game.id);

    if (charsError || !charactersFromDb) {
      console.error("Error fetching characters:", charsError);
      return [];
    }

    const transformedCharacters: Character[] = charactersFromDb.map(
      (charFromDb) => {
        const attributes: { [key: string]: string } = {};
        // Supabase returns CharacterAttribute as an array of objects if the relation is one-to-many
        // and the foreign key is on CharacterAttribute.
        // If CharacterAttribute is an array (expected):
        if (Array.isArray(charFromDb.CharacterAttribute)) {
          for (const ca of charFromDb.CharacterAttribute) {
            const attrDefName = attributeDefinitionMap.get(
              ca.attributeDefinitionId
            );
            if (attrDefName) {
              attributes[attrDefName] = ca.value;
            }
          }
        }

        return {
          value: charFromDb.value,
          label: charFromDb.label,
          imageUrl: charFromDb.imageUrl || "",
          gender: attributes["Gender"] || "",
          fightingStyle: attributes["Fighting Style"] || "",
          nationality: attributes["Nationality"] || "",
          eyeColor: attributes["Eye Color"] || "",
          skinColor: attributes["Skin Color"] || "",
          firstAppearance: attributes["First Appearance"] || "",
          quote: charFromDb.quote || "",
          quoteAttribution: charFromDb.quoteAttribution || "",
        };
      }
    );

    charactersCache = transformedCharacters;
    return transformedCharacters;
  } catch (error) {
    console.error("Error loading characters from Supabase:", error);
    charactersCache = null;
    return [];
  }
}

export const getCharacters = createServerFn({
  method: "GET",
}).handler(async () => {
  return loadCharacters();
});
