import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-content hover:text-content-muted"
        >
          <Info className="h-6 w-6" />
          <span className="sr-only">About</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-olive-light border-content text-content ">
        <DialogHeader>
          <DialogTitle className="text-xl text-content">
            About Avatar Guesser
          </DialogTitle>
          <DialogDescription className="text-content-muted space-y-4">
            <p>
              Avatar Guesser is a daily word-guessing game inspired by the
              beloved Avatar: The Last Airbender series. Taking cues from
              popular games like Wordle, Loldle, and Pokedle, this game
              challenges players to identify characters from the Avatar universe
              through a series of strategic guesses.
            </p>
            <p>
              Each day brings a new character to guess, with clues revealing
              themselves as you make attempts. Use your knowledge of the Avatar
              world to deduce the character's identity through their traits,
              appearance, and memorable quotes.
            </p>
            <p className="text-sm mt-6 border-t border-content pt-4">
              Avatar: The Last Airbender and all related characters are property
              of Nickelodeon and Viacom International Inc. This game is an
              unofficial fan project. All rights to the Avatar franchise belong
              to their respective owners.
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
