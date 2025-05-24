import { Character } from "~/api/characters";
import { useEffect, useState } from "react";

interface WinMessageProps {
  character: Character & { number: number };
  guesses: Character[];
}

export function WinMessage({ character, guesses }: WinMessageProps) {
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");

  useEffect(() => {
    const updateTimeUntilNext = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Format with leading zeros
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");

      setTimeUntilNext(
        `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
      );
    };

    // Update immediately and then every second
    updateTimeUntilNext();
    const interval = setInterval(updateTimeUntilNext, 1000);

    return () => clearInterval(interval);
  }, []);

  const tries = guesses.length;
  const tryText = tries === 1 ? "try" : "tries";

  return (
    <div className="mt-6 p-4 bg-olive-light rounded-lg border-[#78D6FF] border-2 shadow-lg max-w-md mx-auto">
      <div className="flex flex-col items-center gap-4">
        <div className="text-content text-xl font-herculanum">
          Congratulations! You've guessed today's character!
        </div>

        <div className="flex items-center gap-4">
          <img
            src={character.imageUrl}
            alt={character.label}
            className="w-24 h-24 rounded-lg border-2 border-content shadow-md"
          />
          <div className="text-content text-left">
            <div className="font-herculanum text-lg">
              #{character.number}: {character.label}
            </div>
            <div className="text-sm text-content-muted mt-1">
              Guessed in {tries} {tryText}
            </div>
          </div>
        </div>

        <div className="text-sm text-content-muted mt-2 flex flex-col items-center">
          Next character available in
          <div className="text-xl font-herculanum">{timeUntilNext}</div>
        </div>
      </div>
    </div>
  );
}
