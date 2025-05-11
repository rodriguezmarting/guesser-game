import { getCharacters, type Character } from "./characters";
import dailyCharacters from "../data/daily-characters.json";

type DailyCharacter = {
  date: string;
  characterValue: string;
  number: number;
};

export async function getDailyCharacter(): Promise<{
  today: Character & { number: number };
  yesterday: (Character & { number: number }) | null;
}> {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Get all characters for lookup
  const allCharacters = await getCharacters();

  // Find today's character
  const todayEntry = dailyCharacters.characters.find(
    (entry) => entry.date === today
  );

  // Find yesterday's character
  const yesterdayEntry = dailyCharacters.characters.find(
    (entry) => entry.date === yesterday
  );

  // If today's character is not set, select a random one and save it
  if (!todayEntry) {
    const randomCharacter =
      allCharacters[Math.floor(Math.random() * allCharacters.length)];
    const nextNumber = dailyCharacters.nextNumber;

    // Add today's character to the store
    dailyCharacters.characters.unshift({
      date: today,
      characterValue: randomCharacter.value,
      number: nextNumber,
    });

    // Update the next number
    dailyCharacters.nextNumber = nextNumber + 1;

    // In a real app, you would save this to a database
    // For now, we'll just use the in-memory version
    return {
      today: { ...randomCharacter, number: nextNumber },
      yesterday: yesterdayEntry
        ? {
            ...(allCharacters.find(
              (c) => c.value === yesterdayEntry.characterValue
            ) ?? allCharacters[0]),
            number: yesterdayEntry.number,
          }
        : null,
    };
  }

  // Return today's and yesterday's characters
  return {
    today: {
      ...(allCharacters.find((c) => c.value === todayEntry.characterValue) ??
        allCharacters[0]),
      number: todayEntry.number,
    },
    yesterday: yesterdayEntry
      ? {
          ...(allCharacters.find(
            (c) => c.value === yesterdayEntry.characterValue
          ) ?? allCharacters[0]),
          number: yesterdayEntry.number,
        }
      : null,
  };
}
