import { useState, useEffect } from "react";
import { Command } from "cmdk";
import { getCharacters, type Character } from "~/api/characters";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { CharacterSelector } from "~/components/ui/combobox";

interface GuessInputProps {
  selectedCharacter: Character | undefined;
  setSelectedCharacter: (character: Character | undefined) => void;
  handleSubmit: () => void;
  hasWon: boolean;
  duplicateGuess: string | null;
}

export function GuessInput({
  selectedCharacter,
  setSelectedCharacter,
  handleSubmit,
  hasWon,
  duplicateGuess,
}: GuessInputProps) {
  const [open, setOpen] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getCharacters();
      setCharacters(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
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
