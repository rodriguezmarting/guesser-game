import { createFileRoute, Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Netflix-style header */}
      <div className="relative">
        {/* Hero Section with Avatar Poster */}
        <div className="relative h-screen flex items-center justify-center">
          {/* Background poster */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/images/avatar-poster.jpg"
              alt="Avatar: The Last Airbender"
              className="w-full h-full object-cover animate-slow-zoom"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            {/* Gradient overlay for Netflix effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
          </div>

          {/* Content overlay */}
          <div className="font-herculanum relative z-10 text-center text-white max-w-4xl mx-auto px-4 pb-40 sm:pb-32">
            <h1 className="text-6xl md:text-8xl font-bold mb-6  tracking-wider">
              AVATAR
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Enter the world of bending and discover characters from the Avatar
              universe. Test your knowledge in this daily guessing game.
            </p>

            {/* Game selection */}
            <div className="flex flex-col items-center gap-6">
              {/* Avatar Game Button */}
              <div className="flex flex-col items-center">
                <Link to="/avatar">
                  <div className="group cursor-pointer">
                    {/* Square button with Avatar logo */}
                    <div className="w-32 h-32 bg-gradient-to-br from-[#A5A58D] to-[#6B705C] rounded-lg shadow-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-[#8B8B6E]/50 border-2 border-[#8B8B6E] relative overflow-hidden">
                      {/* Background pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" />

                      {/* Avatar logo/emblem */}
                      <div className="relative z-10">
                        <img
                          src="/images/avatar-emblem.avif"
                          alt="Avatar"
                          className="w-20 h-20 object-contain filter brightness-110 transform transition-transform duration-300 group-hover:scale-125"
                        />
                      </div>

                      {/* Subtle hover overlay */}
                      <div className="absolute inset-0 bg-[#8B8B6E] bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Label */}
                    <div className="mt-3 text-center">
                      <p className="text-xl font-boldest text-white group-hover:text-[#A5A58D] transition-colors font-herculanum">
                        Play
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-4">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col gap-4">
              {/* Navigation Links */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
                <Link
                  to="/privacy"
                  className="text-sm text-white hover:text-gray-300 transition-colors underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/contact"
                  className="text-sm text-white hover:text-gray-300 transition-colors underline-offset-4 hover:underline"
                >
                  Contact
                </Link>
              </div>

              {/* Copyright */}
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} Avatar Guesser
                </p>
              </div>

              {/* Disclaimer */}
              <div className="border-t border-gray-700 pt-3 mt-2">
                <p className="text-xs text-gray-500 text-center max-w-4xl mx-auto leading-relaxed">
                  Background image and Avatar: The Last Airbender franchise are
                  property of Nickelodeon and Viacom International Inc. This is
                  an unofficial fan project. All rights belong to their
                  respective owners.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
