"use client";

import Link from "next/link";
import { useState } from "react";

export default function PostSocialsLabel() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <p
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Links to my socials where I post more content are{" "}
      <Link className="underline hover:text-primary" href="/">
        here
      </Link>{" "}
      {isHovered ? (
        <span className="wave text-lg">👋🏼</span>
      ) : (
        <span className="text-lg">👋🏼</span>
      )}
    </p>
  );
}
