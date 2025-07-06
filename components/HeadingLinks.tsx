"use client";

import { useEffect } from "react";

export default function HeadingLinks() {
  useEffect(() => {
    const headings = document.querySelectorAll(
      "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]",
    );

    const handleHeadingClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.id) return;

      // Copy the link for any click on a heading with an ID
      const url = `${window.location.origin}${window.location.pathname}#${target.id}`;
      navigator.clipboard.writeText(url).catch((err) => {
        console.error("Failed to copy: ", err);
      });
    };

    headings.forEach((heading) => {
      // Add cursor pointer to indicate clickability
      (heading as HTMLElement).style.cursor = "pointer";
      heading.addEventListener("click", handleHeadingClick);
    });

    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", handleHeadingClick);
      });
    };
  }, []);

  return null;
}
