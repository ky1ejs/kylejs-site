import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProviderWrapper } from "@/components/Theme/ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "kylejs",
  description: "Kyle Satti | Product Engineer based in Brooklyn, NY.",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              console.log("theme check");
              try {
                // check if data-theme is set in the document
                const theme = document.documentElement.getAttribute("data-theme");
                console.log("theme", theme);
                if (theme !== null && theme !== undefined) {
                  return;
                }
                console.log("not set");
                // read preference from cookies
                const cookieTheme = document.cookie
                  .split("; ")
                  .find((row) => row.startsWith("theme="))
                  ?.split("=")[1];

                console.log("cookie theme", cookieTheme);
                
                if (cookieTheme !== null && cookieTheme !== undefined && cookieTheme !== "system") {
                  document.documentElement.setAttribute("data-theme", cookieTheme);
                  console.log("cookie theme set");
                  return;
                }

                const foundTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                console.log("found theme: ", foundTheme);
                document.documentElement.setAttribute("data-theme", foundTheme);
              } catch (e) {console.error(e);}
            })();
          `,
          }}
        />
      </head>
      <body>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        <SpeedInsights />
      </body>
      <Analytics />
    </html>
  );
}
