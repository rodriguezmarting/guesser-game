import { Character } from "~/api/characters";
import { Cell } from "./Cell";
import { Row } from "./Row";

type GuessRowProps = {
  userGuess: Character;
  characterOfTheDay: Character;
};

type GuessStatus = "right" | "wrong" | "partial";

function getGuessStatus(
  userGuessAttribute: string,
  characterOfTheDayAttribute: string,
  attributeType: "fightingStyle" | "nationality" | "other"
): GuessStatus {
  if (userGuessAttribute === characterOfTheDayAttribute) {
    return "right";
  }

  if (attributeType === "fightingStyle") {
    // Split styles by comma and trim whitespace
    const guessStyles = userGuessAttribute.split(",").map((s) => s.trim());
    const targetStyles = characterOfTheDayAttribute
      .split(",")
      .map((s) => s.trim());

    // Check if there's any overlap between the styles
    const hasOverlap = guessStyles.some((style) =>
      targetStyles.includes(style)
    );
    if (hasOverlap) {
      return "partial";
    }
  }

  if (attributeType === "nationality") {
    // Define elemental nations and their variations
    const elementalNations = {
      air: ["Air Nomads", "Air Nomad"],
      earth: ["Earth Kingdom", "Earth"],
      fire: ["Fire Nation", "Fire"],
      water: ["Water Tribe", "Water"],
    };

    // Helper function to get the elemental nation
    const getElementalNation = (nationality: string): string | null => {
      for (const [element, variations] of Object.entries(elementalNations)) {
        if (variations.some((v) => nationality.includes(v))) {
          return element;
        }
      }
      return null;
    };

    const guessNation = getElementalNation(userGuessAttribute);
    const targetNation = getElementalNation(characterOfTheDayAttribute);

    if (guessNation && targetNation && guessNation === targetNation) {
      return "partial";
    }
  }

  return "wrong";
}

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
        status={getGuessStatus(
          userGuess.gender,
          characterOfTheDay.gender,
          "other"
        )}
        index={0}
      />
      <Cell
        title={userGuess.fightingStyle}
        status={getGuessStatus(
          userGuess.fightingStyle,
          characterOfTheDay.fightingStyle,
          "fightingStyle"
        )}
        index={1}
      />
      <Cell
        title={userGuess.nationality}
        status={getGuessStatus(
          userGuess.nationality,
          characterOfTheDay.nationality,
          "nationality"
        )}
        index={2}
      />
      <Cell
        title={userGuess.eyeColor}
        status={getGuessStatus(
          userGuess.eyeColor,
          characterOfTheDay.eyeColor,
          "other"
        )}
        index={3}
      />
      <Cell
        title={userGuess.skinColor}
        status={getGuessStatus(
          userGuess.skinColor,
          characterOfTheDay.skinColor,
          "other"
        )}
        index={4}
      />
      <Cell
        title={userGuess.firstAppearance}
        status={getGuessStatus(
          userGuess.firstAppearance,
          characterOfTheDay.firstAppearance,
          "other"
        )}
        index={5}
      />
    </Row>
  );
}
