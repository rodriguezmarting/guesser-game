import { Character } from "~/api/characters";
import { CharacterSelector } from "~/components/ui/combobox";

interface GuessInputProps {
  characterOfTheDay: Character;
  guesses: Character[];
  setGuesses: (guesses: Character[]) => void;
  hasWon: boolean;
  setHasWon: (won: boolean) => void;
  duplicateGuess: string | null;
  setDuplicateGuess: (dup: string | null) => void;
}

export function GuessInput({
  characterOfTheDay,
  guesses,
  setGuesses,
  hasWon,
  setHasWon,
  duplicateGuess,
  setDuplicateGuess,
}: GuessInputProps) {
  // No local selectedCharacter state, just handle guess on select
  const handleSelect = (character: Character) => {
    // Check for duplicate
    if (guesses.some((guess) => guess.value === character.value)) {
      setDuplicateGuess(character.label);
      return;
    }
    setDuplicateGuess(null);
    setGuesses([character, ...guesses]);
    // Check for win
    if (character.value === characterOfTheDay.value) {
      setHasWon(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="mt-4 flex justify-center max-w-sm items-center space-x-2">
        <CharacterSelector
          selectedCharacter={undefined}
          setSelectedCharacter={handleSelect}
          disabled={hasWon}
        />
      </div>

      {duplicateGuess && (
        <p className="text-red-500 text-sm font-herculanum">
          You already guessed {duplicateGuess}
        </p>
      )}

      {hasWon && (
        <p className="text-content mt-3 text-lg font-bold">
          Congratulations! You've guessed the character!
        </p>
      )}
    </div>
  );
}
