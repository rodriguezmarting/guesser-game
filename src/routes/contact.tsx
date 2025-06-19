import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, MessageCircle, Lightbulb } from "lucide-react";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
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

          {/* Contact Content */}
          <div className="bg-olive-light border-content border-2 rounded-lg p-6 text-content shadow-lg">
            <h1 className="text-2xl font-herculanum text-content mb-6">
              Contact Us
            </h1>

            <div className="space-y-6 text-content-muted">
              <section>
                <p className="text-lg text-content mb-4">
                  We'd love to hear from you! Whether you have questions,
                  feedback, or ideas for future games, don't hesitate to reach
                  out.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-content mb-3 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Questions & Support
                </h2>
                <p>
                  Having trouble with the game? Found a bug? Have a question
                  about how something works? We're here to help!
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-content mb-3 flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Feedback & Suggestions
                </h2>
                <p>
                  Your feedback helps us improve Avatar Guesser. Let us know
                  what you love, what could be better, or any features you'd
                  like to see added.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-content mb-3 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Future Game Ideas
                </h2>
                <p>
                  Have an idea for the next guessing game? We're always looking
                  for new themes and franchises to explore. Share your
                  suggestions with us!
                </p>
              </section>

              {/* Contact Methods */}
              <div className="mt-8 pt-6 border-t border-content">
                <h2 className="text-lg font-semibold text-content mb-4">
                  Get in Touch
                </h2>

                <div className="space-y-4">
                  {/* Email Contact */}
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-content" />
                    <div>
                      <p className="font-medium text-content">Email</p>
                      <a
                        href="mailto:guessergamecontact@gmail.com"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        guessergamecontact@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Twitter/X Contact */}
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5 text-content"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <div>
                      <p className="font-medium text-content">
                        Follow us on X (Twitter)
                      </p>
                      <a
                        href="https://x.com/AvatarGuesser"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        @AvatarGuesser
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-olive-dark rounded-lg">
                  <p className="text-sm text-white">
                    <strong>Response Time:</strong> We typically respond within
                    24-48 hours. For urgent issues, please include "URGENT" in
                    your email subject line.
                  </p>
                </div>
              </div>

              <div className="text-sm mt-8 pt-6 border-t border-content">
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
