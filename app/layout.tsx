import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProviderWrapper } from "@/components/Theme/ThemeProvider";
import { cookies } from "next/headers";
import {
  effectiveThemeForTheme,
  themeFromString,
} from "@/components/Theme/Theme";

export const metadata: Metadata = {
  title: "kylejs",
  description: "Kyle Satti | Product Engineer based in Brooklyn, NY.",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // get theme from cookies
  const themeString = (await cookies()).get("theme")?.value;
  console.log("themeString", themeString);
  const theme = themeFromString(themeString);
  const effectiveTheme = effectiveThemeForTheme(theme);
  return (
    <html lang="en" data-theme={effectiveTheme} suppressHydrationWarning>
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
                const foundTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                document.documentElement.setAttribute("data-theme", foundTheme);
              } catch (e) {}
            })();
          `,
          }}
        />
      </head>
      <body>
        <ThemeProviderWrapper initialValue={theme}>
          {children}
        </ThemeProviderWrapper>
      </body>
      <Analytics />
    </html>
  );
}
