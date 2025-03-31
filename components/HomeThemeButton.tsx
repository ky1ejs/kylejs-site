"use client";

import ThemeButton, {
  ThemeButtonPosition,
} from "@/components/Theme/ThemeButton";
import { useEffect, useState } from "react";

export default function HomeThemeButton() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    console.log(window.innerWidth);
    setIsMobile(window.innerWidth < 500);
  }, []);

  return (
    <div
      className={`${isMounted ? "opacity-100" : "opacity-0"} fixed z-[1000] ${isMobile ? "bottom-4" : "top-4"} right-4 flex justify-end transition-opacity`}
    >
      <ThemeButton
        position={
          isMobile ? ThemeButtonPosition.Top : ThemeButtonPosition.Bottom
        }
      />
    </div>
  );
}
