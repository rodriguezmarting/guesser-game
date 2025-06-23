import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Avatar Guesser - Avatar Wordle Game",
        description:
          "Avatar Guesser is a daily word-guessing game inspired by the beloved Avatar: The Last Airbender series. Taking cues from popular games like Wordle, Loldle, and Spotle, this game challenges players to identify characters from the Avatar universe through a series of strategic guesses.",
        keywords:
          "avatar the last airbender, legend of korra, avatar game, wordle, daily game, character guessing game, avatar characters, aang, korra, bending game, avatar quiz, avatar trivia, browser game, daily puzzle",
        image: "https://guessergame.com/splash.png",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
    scripts: [
      {
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5286081880171700",
        async: true,
        crossOrigin: "anonymous",
      },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Avatar Guesser",
    alternateName: "Avatar Character Guessing Game",
    description:
      "Avatar Guesser is a daily word-guessing game inspired by the beloved Avatar: The Last Airbender series. Taking cues from popular games like Wordle, Loldle, and Pokedle, this game challenges players to identify characters from the Avatar universe through a series of strategic guesses.",
    url: "https://guessergame.com",
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Avatar Guesser Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Avatar Guesser",
      logo: {
        "@type": "ImageObject",
        url: "https://guessergame.com/android-chrome-512x512.png",
      },
    },
    image: "https://guessergame.com/splash.png",
    screenshot: "https://guessergame.com/splash.png",
    genre: ["Puzzle", "Word Game", "Daily Game"],
    keywords:
      "avatar the last airbender, legend of korra, avatar game, wordle, daily game, character guessing game",
    isAccessibleForFree: true,
    inLanguage: "en-US",
  };

  return (
    <html>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
