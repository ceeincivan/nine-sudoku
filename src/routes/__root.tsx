import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import * as React from "react";
import { ThemeBoot } from "@/components/nine/theme";
import "@/app.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      },
      {
        title: "NINE - Sudoku",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" data-theme="dark" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-paper font-lexend text-ink antialiased selection:bg-ink selection:text-paper">
        <ThemeBoot />
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
