import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/$splat")({
  component: NotFound,
});

function NotFound() {
  return (
    <div className="p-4 min-h-[100vh] bg-[#8B8B6E] bg-opacity-40 relative">
      <div className="max-w-screen-md mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A5A58D] via-[#8B8B6E] to-[#6B705C] opacity-60" />
        <div className="absolute inset-0 backdrop-filter backdrop-blur-[1px]" />

        <div className="relative">
          {/* Navigation buttons */}
          <div className="mb-6 flex gap-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-content hover:text-content-muted"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* 404 Content */}
          <div className="bg-olive-light border-content border-2 rounded-lg p-8 text-content shadow-lg text-center">
            <div className="mb-8">
              {/* Large 404 with Avatar styling */}
              <h1 className="text-6xl font-herculanum text-content mb-4">
                404
              </h1>
              <div className="text-4xl mb-6">🌊🔥🪨💨</div>
            </div>

            <div className="space-y-6 text-content-muted max-w-lg mx-auto">
              <h2 className="text-2xl font-herculanum text-content">
                Lost in the Spirit World?
              </h2>

              <p className="text-lg">
                Looks like you've wandered into the Spirit World! The page
                you're looking for seems to have vanished like Aang in the
                Avatar State.
              </p>

              <div className="bg-olive-dark rounded-lg p-4 my-6">
                <p className="text-sm text-white">
                  <strong>Don't worry!</strong> Even the Avatar gets lost
                  sometimes. Let's get you back to your journey:
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/avatar">
                    <Button
                      variant="ghost"
                      className="text-content hover:text-content-muted"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Back to Avatar Guesser
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-content text-sm">
                <p className="italic">
                  "It's time for you to look inward and start asking yourself
                  the big questions: Who are you? And what do <em>you</em>{" "}
                  want?"
                </p>
                <p className="mt-2 text-content-muted">— Uncle Iroh</p>
              </div>
            </div>

            <div className="text-sm mt-8 pt-6 border-t border-content">
              <p>
                Avatar: The Last Airbender and all related characters are
                property of Nickelodeon and Viacom International Inc. This game
                is an unofficial fan project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
