import type { ReactNode } from "react";

export type NavSection = "writing" | "projects" | "about";

const NAV: Array<{ id: NavSection; label: string; href: string }> = [
  { id: "writing", label: "Writing", href: "/posts" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "about", label: "About", href: "/about" },
];

export interface SiteHeaderProps {
  current?: NavSection;
  /** Sections to show. Defaults to all three. */
  sections?: NavSection[];
  /** Theme control. On the site this is ThemeButton.astro. */
  children?: ReactNode;
}

export function SiteHeader({ current, sections, children }: SiteHeaderProps) {
  const items = sections ? NAV.filter((n) => sections.includes(n.id)) : NAV;
  return (
    <header className="ks-header">
      <div className="ks-header-inner">
        <a className="ks-wordmark" href="/">
          kylejs
        </a>
        <nav className="ks-nav" aria-label="Site">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              aria-current={item.id === current ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
          {children}
        </nav>
      </div>
    </header>
  );
}
