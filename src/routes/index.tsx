import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Character, getCharacters } from "~/api/characters";
import { getDailyCharacter } from "~/api/daily-character";
import { ClueSystem, CLUES } from "~/components/game/ClueSystem";
import { GuessInput } from "~/components/game/GuessInput";
import { GuessHistory } from "~/components/game/GuessHistory";
import { AboutDialog } from "~/components/game/AboutDialog";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    const { today: characterOfTheDay, yesterday } = await getDailyCharacter();
    if (!characterOfTheDay) {
      throw new Error("Failed to load character of the day");
    }
    return { characterOfTheDay, yesterday };
  },
});

function Home() {
  const { characterOfTheDay, yesterday } = Route.useLoaderData();
  const [guesses, setGuesses] = useState<Character[]>([]);
  const [hasWon, setHasWon] = useState(false);
  const [duplicateGuess, setDuplicateGuess] = useState<string | null>(null);
  const [activeClue, setActiveClue] = useState<(typeof CLUES)[number] | null>(
    null
  );
  const [winstreak, setWinstreak] = useState(0);

  // On mount, load saved guesses and winstreak
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // e.g. "2023-10-01"
    const storageKey = "guesses_" + today;
    const saved = localStorage.getItem(storageKey);
    const savedWinstreak = localStorage.getItem("winstreak");
    const lastWinDate = localStorage.getItem("lastWinDate");

    if (savedWinstreak) {
      setWinstreak(parseInt(savedWinstreak, 10));
    }

    if (saved) {
      const { guessValues, hasWon: savedHasWon } = JSON.parse(saved);
      if (guessValues?.length) {
        // Fetch full character data for each saved guess
        getCharacters().then((allCharacters) => {
          const fullGuesses = guessValues
            .map((value: string) =>
              allCharacters.find((c) => c.value === value)
            )
            .filter(
              (c: Character | undefined): c is Character => c !== undefined
            );
          setGuesses(fullGuesses);
        });
      }
      setHasWon(savedHasWon);
    }
  }, []);

  // On every update to guesses or hasWon, persist the current game state
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const storageKey = "guesses_" + today;
    // Store only the character values
    const guessValues = guesses.map((g) => g.value);
    localStorage.setItem(storageKey, JSON.stringify({ guessValues, hasWon }));

    // Update winstreak when winning, but only once per day
    if (hasWon) {
      const lastWinDate = localStorage.getItem("lastWinDate");
      if (lastWinDate !== today) {
        const newWinstreak = winstreak + 1;
        setWinstreak(newWinstreak);
        localStorage.setItem("winstreak", newWinstreak.toString());
        localStorage.setItem("lastWinDate", today);
      }
    }
  }, [guesses, hasWon, winstreak]);

  return (
    <div className="p-4 min-h-[100vh] bg-[#8B8B6E] bg-opacity-40 relative">
      <div className="max-w-screen-md mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A5A58D] via-[#8B8B6E] to-[#6B705C] opacity-60" />
        <div className="absolute inset-0 backdrop-filter backdrop-blur-[1px]" />
        <div className="mt-2 font-herculanum relative flex flex-col items-center bg-transparent text-center">
          <h1 className="tracking-wider text-2xl text-content">
            Guess today's Avatar Character
          </h1>

          {yesterday && (
            <div className="mt-2 text-content-muted text-sm">
              Yesterday's character (#{yesterday.number}) was {yesterday.label}
            </div>
          )}

          <div className="mt-1 text-content-muted text-sm">
            Today's character #{characterOfTheDay.number}
          </div>

          <ClueSystem
            guesses={guesses}
            hasWon={hasWon}
            characterOfTheDay={characterOfTheDay}
            activeClue={activeClue}
            setActiveClue={setActiveClue}
          />

          <GuessInput
            characterOfTheDay={characterOfTheDay}
            guesses={guesses}
            setGuesses={setGuesses}
            hasWon={hasWon}
            setHasWon={setHasWon}
            duplicateGuess={duplicateGuess}
            setDuplicateGuess={setDuplicateGuess}
          />

          <GuessHistory
            guesses={guesses}
            characterOfTheDay={characterOfTheDay}
            hasWon={hasWon}
          />

          <div className="mt-4 text-content-muted">
            Current Winstreak: {winstreak}
          </div>
        </div>
      </div>
      <AboutDialog />
    </div>
  );
}
