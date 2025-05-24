import { Character } from "~/api/characters";
import { useCallback } from "react";
import { ClipboardPaste } from "lucide-react";

interface SocialSharingProps {
  characterNumber: number;
  tries: number;
  guesses: Character[];
  characterOfTheDay: Character;
  domain: string;
}

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
    const guessStyles = userGuessAttribute.split(",").map((s) => s.trim());
    const targetStyles = characterOfTheDayAttribute
      .split(",")
      .map((s) => s.trim());
    const hasOverlap = guessStyles.some((style) =>
      targetStyles.includes(style)
    );
    if (hasOverlap) return "partial";
  }

  if (attributeType === "nationality") {
    const elementalNations = {
      air: ["Air Nomads", "Air Nomad"],
      earth: ["Earth Kingdom", "Earth"],
      fire: ["Fire Nation", "Fire"],
      water: ["Water Tribe", "Water"],
    };
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

const statusToEmoji = {
  right: "🟩",
  partial: "🟨",
  wrong: "🟥",
};

export function SocialSharing({
  characterNumber,
  tries,
  guesses,
  characterOfTheDay,
  domain,
}: SocialSharingProps) {
  const shareText = `I found #AvatarGuesser character #${characterNumber} in ${tries} ${
    tries === 1 ? "try" : "tries"
  }`;
  const url = `${domain}`;

  // Build the grid
  const grid = guesses.map((guess) => {
    const statuses: GuessStatus[] = [
      getGuessStatus(guess.gender, characterOfTheDay.gender, "other"),
      getGuessStatus(
        guess.fightingStyle,
        characterOfTheDay.fightingStyle,
        "fightingStyle"
      ),
      getGuessStatus(
        guess.nationality,
        characterOfTheDay.nationality,
        "nationality"
      ),
      getGuessStatus(guess.eyeColor, characterOfTheDay.eyeColor, "other"),
      getGuessStatus(guess.skinColor, characterOfTheDay.skinColor, "other"),
      getGuessStatus(
        guess.firstAppearance,
        characterOfTheDay.firstAppearance,
        "other"
      ),
    ];
    return statuses.map((s) => statusToEmoji[s]).join("");
  });

  const fullText = `${shareText}\n\n${grid.join("\n")}\n\n${url}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(fullText);
  }, [fullText]);

  const handleShare = useCallback(() => {
    const tweet = encodeURIComponent(fullText);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, "_blank");
  }, [fullText]);

  return (
    <div className="mt-6 p-4 bg-olive-light rounded-lg border-black border-[1px] shadow-lg max-w-md mx-auto flex flex-col items-center">
      <div className="text-content text-lg font-herculanum text-center mb-4 whitespace-pre-line">
        {shareText}
      </div>
      <div className="flex flex-col items-center mb-4">
        {grid.map((row, i) => (
          <div key={i} className="text-2xl font-mono leading-tight">
            {row}
          </div>
        ))}
      </div>
      <div className="text-content-muted text-center mb-4">{url}</div>
      <div className="flex gap-4">
        <button
          className="bg-olive hover:bg-[#A5A58D] text-white px-4 py-2 rounded flex items-center gap-2 font-bold"
          onClick={handleCopy}
        >
          <ClipboardPaste className="w-5 h-5" /> COPY
        </button>
        <button
          className="bg-black hover:bg-neutral-800 text-white pl-2 pr-4 py-2 rounded flex items-center font-bold"
          onClick={handleShare}
        >
          <img
            src="/icons/twitter-x.svg"
            alt="Share on X"
            className="w-8 h-8"
          />
          SHARE
        </button>
      </div>
    </div>
  );
}
