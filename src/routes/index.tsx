import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { characters } from "~/api/characters";
import { ClueSystem, CLUES } from "~/components/game/ClueSystem";
import { GuessInput } from "~/components/game/GuessInput";
import { GuessHistory } from "~/components/game/GuessHistory";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    const characterOfTheDay =
      characters[Math.floor(Math.random() * characters.length)];
    return { characterOfTheDay };
  },
});

function Home() {
  const [selectedCharacter, setSelectedCharacter] =
    useState<(typeof characters)[number]>();
  const [guesses, setGuesses] = useState<(typeof characters)[number][]>([]);
  const [hasWon, setHasWon] = useState(false);
  const [duplicateGuess, setDuplicateGuess] = useState<string | null>(null);
  const [activeClue, setActiveClue] = useState<(typeof CLUES)[number] | null>(
    null
  );

  const { characterOfTheDay } = Route.useLoaderData();

  const handleSubmit = () => {
    if (!selectedCharacter) return;

    // Check if character was already guessed
    if (guesses.some((guess) => guess.value === selectedCharacter.value)) {
      setDuplicateGuess(selectedCharacter.label);
      return;
    }

    setGuesses((prev) => [selectedCharacter, ...prev]);
    setSelectedCharacter(undefined); // Reset selection after guess
    setDuplicateGuess(null); // Clear any duplicate message

    // Check if the guess is correct
    if (selectedCharacter.value === characterOfTheDay.value) {
      setHasWon(true);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-[#8B8B6E] bg-opacity-40 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#A5A58D] via-[#8B8B6E] to-[#6B705C] opacity-60" />
      <div className="absolute inset-0 backdrop-filter backdrop-blur-[1px]" />
      <div className="mt-2 font-herculanum relative flex flex-col items-center bg-transparent text-center">
        <h1 className="tracking-wider text-2xl text-content">
          Guess today's Avatar Character
        </h1>

        <ClueSystem
          guesses={guesses}
          hasWon={hasWon}
          characterOfTheDay={characterOfTheDay}
          activeClue={activeClue}
          setActiveClue={setActiveClue}
        />

        <GuessInput
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={(char) => {
            setSelectedCharacter(char);
            setDuplicateGuess(null);
          }}
          handleSubmit={handleSubmit}
          hasWon={hasWon}
          duplicateGuess={duplicateGuess}
        />

        <GuessHistory
          guesses={guesses}
          characterOfTheDay={characterOfTheDay}
          hasWon={hasWon}
        />
      </div>
    </div>
  );
}
