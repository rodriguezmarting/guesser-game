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
  quote: string;
  voiceUrl: string;
}

let charactersCache: Character[] | null = null;

async function loadCharacters(): Promise<Character[]> {
  if (charactersCache) {
    return charactersCache;
  }
  try {
    // Always read from filesystem (server-side)
    const filePath = join(process.cwd(), "public", "characters.json");
    const data = await fs.readFile(filePath, "utf-8");
    const characters = JSON.parse(data) as Character[];
    charactersCache = characters;
    return characters;
  } catch (error) {
    console.error("Error loading characters:", error);
    return [];
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
