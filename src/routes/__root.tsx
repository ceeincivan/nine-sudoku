import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import * as React from "react";
import { ThemeBoot } from "@/components/nine/theme";
import "@/app.css";
import { GA_MEASUREMENT_ID, initGA } from "@/lib/analytics";

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
    scripts: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
        async: true,
      },
      {
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
        `,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  React.useEffect(() => {
    initGA(GA_MEASUREMENT_ID);
  }, []);

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
