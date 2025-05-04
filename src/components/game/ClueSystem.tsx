import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

// Clue configuration
export const CLUES = [
  {
    tries: 5,
    label: "5 tries left",
    type: "visual",
    title: "Visual Clue",
    description: "A glimpse of the character's appearance",
  },
  {
    tries: 8,
    label: "8 tries left",
    type: "quote",
    title: "Quote Clue",
    description: "A memorable line from the character",
  },
  {
    tries: 10,
    label: "10 tries left",
    type: "sound",
    title: "Sound Clue",
    description: "Listen to the character's voice",
  },
] as const;

type ClueSystemProps = {
  guesses: any[];
  hasWon: boolean;
  characterOfTheDay: any;
  activeClue: (typeof CLUES)[number] | null;
  setActiveClue: (clue: (typeof CLUES)[number] | null) => void;
};

export function ClueSystem({
  guesses,
  hasWon,
  characterOfTheDay,
  activeClue,
  setActiveClue,
}: ClueSystemProps) {
  const getClueLabel = (tries: number) => {
    if (hasWon) return "View clue";
    const remainingTries = tries - guesses.length;
    if (remainingTries <= 0) return "Clue ready!";
    return `${remainingTries} tries left`;
  };

  const handleClueClick = (clue: (typeof CLUES)[number]) => {
    if (hasWon || guesses.length >= clue.tries) {
      setActiveClue(clue);
    }
  };

  const renderClueContent = () => {
    if (!activeClue) return null;

    switch (activeClue.type) {
      case "visual":
        return (
          <div className="flex flex-col items-center gap-4">
            <img
              src={characterOfTheDay.image}
              alt="Character silhouette"
              className="w-48 h-48 object-cover filter brightness-0 border-[1px] border-content rounded-sm"
            />
            <p className="text-content-muted text-sm">
              This is a silhouette of the character. Notice any distinctive
              features?
            </p>
          </div>
        );
      case "quote":
        return (
          <div className="flex flex-col items-center gap-4">
            <blockquote className="text-content text-lg italic border-l-2 border-content pl-4">
              {characterOfTheDay.quoteText ? (
                `"${characterOfTheDay.quoteText}"`
              ) : (
                <span className="text-content-muted">No quote available</span>
              )}
            </blockquote>
            {hasWon && characterOfTheDay.quoteAttribution && (
              <p className="text-content-muted text-sm mt-2">
                {characterOfTheDay.quoteAttribution}
              </p>
            )}
            <p className="text-content-muted text-sm">
              A memorable line that reveals their personality
            </p>
          </div>
        );
      case "sound":
        return (
          <div className="flex flex-col items-center gap-4">
            <audio
              controls
              className="w-full [&::-webkit-media-controls-panel]:bg-olive [&::-webkit-media-controls-panel]:border-content [&::-webkit-media-controls-panel]:border [&::-webkit-media-controls-playback-rate-button]:hidden"
              controlsList="noplaybackrate"
            >
              <source
                src={getCharacterSound(characterOfTheDay.value)}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
            <p className="text-content-muted text-sm">
              Listen carefully to their voice and manner of speaking
            </p>
          </div>
        );
    }
  };

  return (
    <div className="mt-3 w-full flex justify-center text-content">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between border-content border-2 border-x-0 text-content font-bold text-lg">
          <span>&#9660;&#9660;&#9660;</span>
          <h4>Clues</h4>
          <span>&#9660;&#9660;&#9660;</span>
        </div>
        <ul className="mt-2 flex gap-4 justify-center">
          {CLUES.map((clue, index) => (
            <li key={index}>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    onClick={() => handleClueClick(clue)}
                    className="flex flex-col items-center"
                    disabled={!hasWon && guesses.length < clue.tries}
                  >
                    <img
                      src="/images/avatar-emblem.avif"
                      alt="Avatar Emblem"
                      className={`shadow-md p-1 w-14 h-14 border-[1px] border-content rounded-sm ${
                        hasWon || guesses.length >= clue.tries
                          ? "opacity-100"
                          : "opacity-50"
                      }`}
                    />
                    <label className="mt-1 w-14 text-content-muted text-sm">
                      {getClueLabel(clue.tries)}
                    </label>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-olive-light border-content text-content font-herculanum">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-content">
                      {clue.title}
                    </DialogTitle>
                    <DialogDescription className="text-content-muted">
                      {clue.description}
                    </DialogDescription>
                  </DialogHeader>
                  {renderClueContent()}
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Helper functions for clues
function getCharacterQuote(character: string): string {
  const quotes: Record<string, string> = {
    Aang: "When we hit our lowest point, we are open to the greatest change.",
    Zuko: "I'm going to speak my mind, and you're going to listen.",
    Katara: "I will never, ever turn my back on people who need me!",
    Sokka:
      "I'm just a guy with a boomerang. I didn't ask for all this flying and magic!",
    Toph: "I am not Toph! I am MELON LORD! MWAHAHAHA!",
    Iroh: "In the darkest times, hope is something you give yourself.",
    Azula: "I'm about to celebrate becoming an only child!",
  };
  return quotes[character] || "A mysterious quote from the character...";
}

function getCharacterSound(character: string): string {
  const sounds: Record<string, string> = {
    Aang: "/sounds/aang.mp3",
    Zuko: "/sounds/zuko.mp3",
    Katara: "/sounds/katara.mp3",
  };
  return sounds[character] || "/sounds/default.mp3";
}
