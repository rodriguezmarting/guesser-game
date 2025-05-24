import { createServerFn } from "@tanstack/react-start";
import { promises as fs } from "fs";
import { join } from "path";

export interface DailyCharacter {
  date: string;
  number: number;
  characterId: string;
  guesses: number;
}

export interface GameData {
  characters: DailyCharacter[];
  lastUpdated: string;
}

const DATA_DIR = join(process.cwd(), "public", "data");
const GAME_DATA_PATH = join(DATA_DIR, "daily-characters.json");

async function readJsonFile<T>(path: string): Promise<T> {
  const content = await fs.readFile(path, "utf-8");
  return JSON.parse(content) as T;
}

async function writeJsonFile<T>(path: string, data: T): Promise<void> {
  await fs.writeFile(path, JSON.stringify(data, null, 2));
}

export const getDailyCharacter = createServerFn({
  method: "GET",
}).handler(async () => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const gameData = await readJsonFile<GameData>(GAME_DATA_PATH);
  const todayChar = gameData.characters.find((c) => c.date === today) || null;
  const yesterdayChar =
    gameData.characters.find((c) => c.date === yesterday) || null;
  return { today: todayChar, yesterday: yesterdayChar };
});

export const getCharacterStats = createServerFn({
  method: "GET",
}).handler(async () => {
  const gameData = await readJsonFile<GameData>(GAME_DATA_PATH);
  const guesses = gameData.characters.reduce((acc, char) => {
    acc[char.characterId] = char.guesses;
    return acc;
  }, {} as Record<string, number>);
  return { guesses };
});

export const incrementCharacterGuess = createServerFn({
  method: "POST",
})
  .validator((data: { characterId: string }) => data)
  .handler(async ({ data }) => {
    const gameData = await readJsonFile<GameData>(GAME_DATA_PATH);
    const character = gameData.characters.find(
      (c) => c.characterId === data.characterId
    );
    if (character) {
      character.guesses = (character.guesses || 0) + 1;
      gameData.lastUpdated = new Date().toISOString();
      await writeJsonFile(GAME_DATA_PATH, gameData);
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
    const gameData = await readJsonFile<GameData>(GAME_DATA_PATH);
    gameData.characters = gameData.characters.filter(
      (c) => c.date !== data.date
    );
    gameData.characters.push({
      date: data.date,
      characterId: data.characterId,
      number: data.number,
      guesses: 0,
    });
    gameData.characters.sort((a, b) => a.date.localeCompare(b.date));
    gameData.lastUpdated = new Date().toISOString();
    await writeJsonFile(GAME_DATA_PATH, gameData);
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
    const gameData = await readJsonFile<GameData>(GAME_DATA_PATH);
    data.characterIds.forEach((id) => {
      const character = gameData.characters.find((c) => c.characterId === id);
      if (character) {
        character.guesses = character.guesses || 0;
      }
    });
    gameData.lastUpdated = new Date().toISOString();
    await writeJsonFile(GAME_DATA_PATH, gameData);
    return { success: true };
  });
