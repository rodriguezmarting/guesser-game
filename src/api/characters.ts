import { createServerFn } from "@tanstack/react-start";
import { promises as fs } from "fs";
import { join } from "path";

export interface Character {
  value: string;
  label: string;
  gender: string;
  fightingStyle: string;
  nationality: string;
  firstAppearance: string;
  imageUrl: string;
  silhouetteUrl: string;
  voiceUrl: string;
  quoteText: string;
  quoteAttribution: string;
}

let charactersCache: Character[] | null = null;

async function loadCharacters(): Promise<Character[]> {
  if (charactersCache) return charactersCache;
  try {
    const baseUrl =
      typeof window !== "undefined"
        ? ""
        : process.env.URL || process.env.DEPLOY_URL || "http://localhost:8888";
    const response = await fetch(`${baseUrl}/characters.json`);
    if (!response.ok) throw new Error("Failed to fetch characters.json");
    const characters = (await response.json()) as Character[];
    charactersCache = characters;
    return characters;
  } catch (error) {
    // Fallback to filesystem for local dev
    try {
      const filePath = join(process.cwd(), "public", "characters.json");
      const data = await fs.readFile(filePath, "utf-8");
      const characters = JSON.parse(data) as Character[];
      charactersCache = characters;
      return characters;
    } catch (fsError) {
      console.error("Error loading characters from filesystem:", fsError);
      return [];
    }
  }
}

export const getCharacters = createServerFn({
  method: "GET",
}).handler(async () => {
  return loadCharacters();
});

export const getRandomCharacter = createServerFn({
  method: "GET",
}).handler(async () => {
  const characters = await loadCharacters();
  if (characters.length === 0) return null;
  return characters[Math.floor(Math.random() * characters.length)];
});
