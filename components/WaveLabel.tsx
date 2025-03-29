"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function WaveLabel({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <p
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}{" "}
      {isHovered ? (
        <span className="wave text-lg">👋🏼</span>
      ) : (
        <span className="text-lg">👋🏼</span>
      )}
    </p>
  );
}
