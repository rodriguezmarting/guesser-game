import { EmptyRow } from "./cells/EmptyRow";
import { GuessRow } from "./cells/GuessRow";
import { Character } from "~/api/characters";

type GuessHistoryProps = {
  guesses: Character[];
  characterOfTheDay: Character & { number: number };
  hasWon: boolean;
};

export function GuessHistory({
  guesses,
  characterOfTheDay,
  hasWon,
}: GuessHistoryProps) {
  return (
    <div className="w-full mt-4 mx-auto px-0.5 flex justify-center">
      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col">
          <div className="flex items-end space-x-2 text-[10px] text-center mb-2">
            <div className="w-16 flex-shrink-0 border-b-2 border-content">
              Character
            </div>
            <div className="w-16 flex-shrink-0 border-b-2 border-content">
              Gender
            </div>
            <div className="w-16 flex-shrink-0 border-b-2 border-content">
              Fighting Style
            </div>
            <div className="w-16 flex-shrink-0 border-b-2 border-content">
              Nationality
            </div>
            <div className="w-16 flex-shrink-0 border-b-2 border-content">
              Eye Color
            </div>
            <div className="w-16 flex-shrink-0 border-b-2 border-content">
              Skin Color
            </div>
            <div className="w-16 flex-shrink-0 border-b-2 border-content">
              Debut
            </div>
          </div>
          <div className="flex flex-col-reverse">
            {guesses.map((guess) => (
              <GuessRow
                key={guess.value}
                userGuess={guess}
                characterOfTheDay={characterOfTheDay}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
