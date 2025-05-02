import { Button } from "~/components/ui/button";
import { CharacterSelector } from "~/components/ui/combobox";
import { characters } from "~/api/characters";

type GuessInputProps = {
  selectedCharacter: (typeof characters)[number] | undefined;
  setSelectedCharacter: (char: (typeof characters)[number] | undefined) => void;
  handleSubmit: () => void;
  hasWon: boolean;
  duplicateGuess: string | null;
};

export function GuessInput({
  selectedCharacter,
  setSelectedCharacter,
  handleSubmit,
  hasWon,
  duplicateGuess,
}: GuessInputProps) {
  return (
    <>
      <div className="mt-4 flex justify-center max-w-sm items-center space-x-2">
        <CharacterSelector
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={setSelectedCharacter}
          disabled={hasWon}
        />
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!selectedCharacter || hasWon}
          className="bg-olive hover:bg-olive/80 rounded-none text-[#78D6FF] text-2xl drop-shadow-[0_0_2px_rgba(120,214,255,0.6)] hover:drop-shadow-[0_0_4px_rgba(120,214,255,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &#9654;
        </Button>
      </div>
      {duplicateGuess && (
        <p className="text-content-muted mt-2 text-sm">
          You already tried with {duplicateGuess}
        </p>
      )}
      {hasWon && (
        <p className="text-content mt-3 text-lg font-bold">
          Congratulations! You've guessed the character!
        </p>
      )}
    </>
  );
}
