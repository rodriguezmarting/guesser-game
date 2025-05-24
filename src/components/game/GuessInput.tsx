import { Character } from "~/api/characters";
import { CharacterSelector } from "~/components/ui/combobox";
import { useState } from "react";

interface GuessInputProps {
  characterOfTheDay: Character & { number: number };
  guesses: Character[];
  setGuesses: (guesses: Character[]) => void;
  hasWon: boolean;
  setHasWon: (hasWon: boolean) => void;
  duplicateGuess: string | null;
  setDuplicateGuess: (guess: string | null) => void;
  onGuess: (character: Character) => Promise<void>;
}

export function GuessInput({
  characterOfTheDay,
  guesses,
  setGuesses,
  hasWon,
  setHasWon,
  duplicateGuess,
  setDuplicateGuess,
  onGuess,
}: GuessInputProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const handleSelect = async (character: Character) => {
    // Check for duplicate
    if (guesses.some((guess) => guess.value === character.value)) {
      setDuplicateGuess(character.value);
      return;
    }

    setSelectedCharacter(character);
    await onGuess(character);
    setDuplicateGuess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharacter) return;

    // Check for duplicate guess
    if (guesses.some((g) => g.value === selectedCharacter.value)) {
      setDuplicateGuess(selectedCharacter.value);
      return;
    }

    await onGuess(selectedCharacter);
    setSelectedCharacter(null);
    setDuplicateGuess(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="mt-4 flex justify-center max-w-sm items-center space-x-2">
        <CharacterSelector
          selectedCharacter={undefined}
          setSelectedCharacter={handleSelect}
          disabled={hasWon}
          guesses={guesses}
        />
      </div>

      {duplicateGuess && (
        <p className="text-red-500 text-sm font-herculanum">
          You already guessed {duplicateGuess}
        </p>
      )}
    </div>
  );
}
