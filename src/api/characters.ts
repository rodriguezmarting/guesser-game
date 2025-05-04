import { createServerFn } from "@tanstack/react-start";

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
    // Always fetch via HTTP for Netlify compatibility
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
