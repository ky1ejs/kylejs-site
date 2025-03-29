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
  <div className="sticky top-0 bg-background-primary pb-4 pt-4 z-[1000]">
    <div className="content-inset flex items-center justify-between">
      <div>
        <Link href="/">
          <span className="text-3xl">kylejs</span>
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        <NavItem title="About" route="/about" />
        <NavItem title="Posts" route="/posts" />
        <ThemeButton />
        <div></div>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <div className="text-center pt-12 pb-4 content-inset text-muted">
    <hr className="border-t-1 border-gray-300 mb-3" />
    <div className="flex gap-4 justify-center">
      <Link href="/about">
        About
      </Link>
      <Link href="/posts">
        Posts
      </Link>
    </div>
    <Copyright />
  </div>
)

export default function PostsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="content-inset mx-auto max-w-[800px]">{children}</div>
      <Footer />
    </>
  );
}
