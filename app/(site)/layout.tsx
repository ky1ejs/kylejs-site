import Copyright from "@/components/Copyright";
import ThemeButton from "@/components/Theme/ThemeButton";
import Link from "next/link";
import { ReactNode } from "react";

const NavItem = ({ title, route }: { title: string; route: string }) => (
  <div>
    <Link className="text-lg" href={route}>
      {title}
    </Link>
  </div>
);

const Header = () => (
  <div className="sticky top-0 z-[1000] bg-background-primary pb-4 pt-4">
    <div className="content-inset flex items-center justify-between">
      <div>
        <Link href="/">
          <span className="text-3xl">kylejs</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <NavItem title="About" route="/about" />
        <NavItem title="Posts" route="/posts" />
        <ThemeButton />
        <div></div>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <div className="content-inset pb-4 pt-12 text-center text-muted">
    <hr className="border-t-1 mb-3 border-gray-300" />
    <div className="flex justify-center gap-4">
      <Link href="/about">About</Link>
      <Link href="/posts">Posts</Link>
    </div>
    <Copyright />
  </div>
);

export default function PostsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="content-inset mx-auto max-w-[800px]">{children}</div>
      <Footer />
    </>
  );
}
