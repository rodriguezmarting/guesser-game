import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="p-4 min-h-[100vh] bg-[#8B8B6E] bg-opacity-40 relative">
      <div className="max-w-screen-md mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A5A58D] via-[#8B8B6E] to-[#6B705C] opacity-60" />
        <div className="absolute inset-0 backdrop-filter backdrop-blur-[1px]" />

        <div className="relative">
          {/* Back button */}
          <div className="mb-6">
            <Link to="/avatar">
              <Button
                variant="ghost"
                className="text-content hover:text-content-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Game
              </Button>
            </Link>
          </div>

          {/* Privacy Policy Content */}
          <div className="bg-olive-light border-content border-2 rounded-lg p-6 text-content shadow-lg">
            <h1 className="text-2xl font-herculanum text-content mb-6">
              Privacy Policy
            </h1>

            <div className="space-y-6 text-content-muted">
              <section>
                <h2 className="text-lg font-semibold text-content mb-3">
                  Information We Collect
                </h2>
                <p>
                  Avatar Guesser is designed with privacy in mind. We collect
                  minimal information to provide you with the best gaming
                  experience:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Game statistics and progress (stored locally on your device)
                  </li>
                  <li>
                    No personal information, email addresses, or user accounts
                    are required
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-content mb-3">
                  Local Storage
                </h2>
                <p>
                  Your game progress, including guesses and win streaks, are
                  stored locally in your browser. This information never leaves
                  your device and can be cleared by you at any time through your
                  browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-content mb-3">
                  Third-Party Services
                </h2>
                <p>
                  This game does not use third-party services for analytics and
                  performance monitoring.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-content mb-3">
                  Data Security
                </h2>
                <p>
                  Since we don't collect personal information, there's minimal
                  risk to your privacy. All game data is stored locally on your
                  device and is under your control.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-content mb-3">
                  Changes to Privacy Policy
                </h2>
                <p>
                  We may update this privacy policy from time to time. Any
                  changes will be reflected on this page with an updated date.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-content mb-3">
                  Contact
                </h2>
                <p>
                  If you have any questions about this privacy policy or your
                  data, you can contact us through our support channels.
                </p>
              </section>

              <div className="text-sm mt-8 pt-6 border-t border-content">
                <p>
                  <strong>Last updated:</strong>{" "}
                  {new Date().toLocaleDateString()}
                </p>
                <p className="mt-4">
                  Avatar: The Last Airbender and all related characters are
                  property of Nickelodeon and Viacom International Inc. This
                  game is an unofficial fan project. All rights to the Avatar
                  franchise belong to their respective owners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
