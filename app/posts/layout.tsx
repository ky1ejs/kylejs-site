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
  <div className="sticky top-0 bg-default pb-4 pt-4">
    <div className="content-inset flex items-center justify-between">
      <div>
        <Link href="/">
          <h1 className="text-3xl">kylejs</h1>
        </Link>
      </div>
      <div>
        <NavItem title="Posts" route="/posts" />
        <div></div>
      </div>
    </div>
  </div>
);

export default function PostsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="content-inset mx-auto max-w-[800px]">{children}</div>
    </>
  );
}
