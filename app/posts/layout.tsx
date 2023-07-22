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
  <div className="mb-6 mt-2 flex items-center justify-between">
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
);

export default function PostsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-4">
      <Header />
      <div>{children}</div>
    </div>
  );
}
