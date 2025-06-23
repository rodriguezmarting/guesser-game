export const seo = ({
  title,
  description,
  keywords,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
}) => {
  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "author", content: "Avatar Guesser Game" },
    { name: "robots", content: "index, follow" },
    { name: "theme-color", content: "#8B8B6E" },
    // Twitter/X Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: "@AvatarGuesser" },
    { name: "twitter:site", content: "@AvatarGuesser" },
    // Open Graph tags
    { name: "og:type", content: "website" },
    { name: "og:title", content: title },
    { name: "og:description", content: description },
    { name: "og:site_name", content: "Avatar Guesser" },
    { name: "og:url", content: "https://guessergame.com" },
    // Game-specific tags
    { name: "application-name", content: "Avatar Guesser" },
    { name: "apple-mobile-web-app-title", content: "Avatar Guesser" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    // Additional SEO tags for better search appearance
    { name: "og:site_name", content: "Avatar Guesser" },
    { name: "twitter:domain", content: "guessergame.com" },
    { name: "format-detection", content: "telephone=no" },
    ...(image
      ? [
          { name: "twitter:image", content: image },
          {
            name: "twitter:image:alt",
            content: "Avatar Guesser - Daily Character Guessing Game",
          },
          { name: "og:image", content: image },
          {
            name: "og:image:alt",
            content: "Avatar Guesser - Daily Character Guessing Game",
          },
          { name: "og:image:width", content: "1200" },
          { name: "og:image:height", content: "630" },
        ]
      : []),
  ];

  return tags;
};
