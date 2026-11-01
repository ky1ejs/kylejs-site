import type { NavSection } from "./SiteHeader";
import { SocialLinks } from "./SocialLinks";
import type { SocialLink } from "../socials";

const SITE: Array<{ id: NavSection; label: string; href: string }> = [
  { id: "writing", label: "Writing", href: "/posts" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "about", label: "About", href: "/about" },
];

export interface SiteFooterProps {
  year: number;
  sections?: NavSection[];
  socials?: SocialLink[];
}

export function SiteFooter({ year, sections, socials }: SiteFooterProps) {
  const site = sections ? SITE.filter((s) => sections.includes(s.id)) : SITE;
  return (
    <footer className="ks-footer">
      <ul className="ks-footer-links" aria-label="Site">
        {site.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <SocialLinks links={socials} />
      <p className="ks-footer-copyright">© {year} Kyle Satti</p>
    </footer>
  );
}
