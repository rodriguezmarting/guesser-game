import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Redirect to /avatar for better SEO
    throw redirect({
      to: "/avatar",
    });
  },
});
