import { ScrollArea } from "~/components/ui/scroll-area";
import { EmptyRow } from "./cells/EmptyRow";
import { GuessRow } from "./cells/GuessRow";
import { characters } from "~/api/characters";

type GuessHistoryProps = {
  guesses: (typeof characters)[number][];
  characterOfTheDay: (typeof characters)[number];
  hasWon: boolean;
};

export function GuessHistory({
  guesses,
  characterOfTheDay,
  hasWon,
}: GuessHistoryProps) {
  return (
    <>
      <p className="text-content-muted mt-3 text-xs">
        <span className="text-sm text-content">12311</span> people already
        guessed the character
      </p>
      <div className="mt-4 flex justify-center max-w-sm items-end space-x-2 text-[10px] text-center">
        <div className="w-16 border-b-2 border-content">Character</div>
        <div className="w-16 border-b-2 border-content">Gender</div>
        <div className="w-16 border-b-2 border-content">Fighting Style</div>
        <div className="w-16 border-b-2 border-content">Nationality</div>
        <div className="w-16 border-b-2 border-content">Debut</div>
      </div>
      <div className="h-[300px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {guesses.map((guess) => (
          <GuessRow
            key={guess.value}
            userGuess={guess}
            characterOfTheDay={characterOfTheDay}
          />
        ))}
        {!guesses.length && !hasWon && <EmptyRow />}
      </div>
    </>
  );
}
