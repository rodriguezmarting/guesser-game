import { Character } from "~/api/characters";
import { Cell } from "./Cell";
import { Row } from "./Row";

type GuessRowProps = {
  userGuess: Character;
  characterOfTheDay: Character;
};

export function GuessRow({ userGuess, characterOfTheDay }: GuessRowProps) {
  return (
    <Row>
      <img
        src={userGuess.imageUrl}
        alt={userGuess.value}
        className="shadow-md w-16 h-16 border-[1px] border-content rounded-sm"
      />
      <Cell
        title={userGuess.gender}
        status={getGuessStatus(userGuess.gender, characterOfTheDay.gender)}
        index={0}
      />
      <Cell
        title={userGuess.fightingStyle}
        status={getGuessStatus(
          userGuess.fightingStyle,
          characterOfTheDay.fightingStyle
        )}
        index={1}
      />
      <Cell
        title={userGuess.nationality}
        status={getGuessStatus(
          userGuess.nationality,
          characterOfTheDay.nationality
        )}
        index={2}
      />
      <Cell
        title={userGuess.eyeColor}
        status={getGuessStatus(userGuess.eyeColor, characterOfTheDay.eyeColor)}
        index={3}
      />
      <Cell
        title={userGuess.skinColor}
        status={getGuessStatus(
          userGuess.skinColor,
          characterOfTheDay.skinColor
        )}
        index={4}
      />
      <Cell
        title={userGuess.firstAppearance}
        status={getGuessStatus(
          userGuess.firstAppearance,
          characterOfTheDay.firstAppearance
        )}
        index={5}
      />
    </Row>
  );
}

function getGuessStatus(
  userGuessAttribute: string,
  characterOfTheDayAttribute: string
) {
  if (userGuessAttribute === characterOfTheDayAttribute) {
    return "right";
  }
  return "wrong";
}
