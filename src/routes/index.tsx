import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ArrowRightIcon } from "~/components/icons/arrow-right";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="p-4 min-h-screen bg-black">
      <Card className="flex flex-col items-center bg-gradient-to-b from-slate-900 to-slate-950 text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            <h1>Guess the Character</h1>
          </CardTitle>
          <CardDescription className="text-yellow-500">
            <p>12311 people already guessed the character</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center text-white">
          <ul className="flex gap-4">
            <li>Clue 1</li>
            <li>Clue 2</li>
            <li>Clue 3</li>
          </ul>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center max-w-sm items-center space-x-2">
            <Input type="email" placeholder="Character Name" />
            <Button type="submit">
              <ArrowRightIcon />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
