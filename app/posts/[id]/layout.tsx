import Link from "next/link";
import { ReactNode } from "react";

export default function PostLayout({ children }: { children: ReactNode }) {
  return (
    <>
    <Link href="/">Home</Link>
    <Link href="/posts">Back</Link>
    <div>{children}</div>
    </>
  );
}