"use client";

import ThemeButton, {
  ThemeButtonPosition,
} from "@/components/Theme/ThemeButton";
import { useIsMounted } from "@/lib/use-is-mounted";
import { useSyncExternalStore } from "react";

const subscribeToResize = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};

export default function HomeThemeButton() {
  const isMounted = useIsMounted();
  const isMobile = useSyncExternalStore(
    subscribeToResize,
    () => window.innerWidth < 500,
    () => false,
  );

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
