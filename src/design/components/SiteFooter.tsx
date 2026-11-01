import type { NavSection } from "./SiteHeader";

export interface FooterLink {
  label: string;
  href: string;
}

export const socialLinks: FooterLink[] = [
  { label: "GitHub", href: "https://github.com/ky1ejs" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kylejs/" },
  { label: "Instagram", href: "https://instagram.com/_kylejs_" },
  { label: "Threads", href: "https://www.threads.net/@_kylejs_" },
  { label: "Spotify", href: "https://open.spotify.com/user/kylejm_" },
];

const SITE: Array<{ id: NavSection; label: string; href: string }> = [
  { id: "writing", label: "Writing", href: "/posts" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "about", label: "About", href: "/about" },
];

export interface SiteFooterProps {
  year: number;
  sections?: NavSection[];
  socials?: FooterLink[];
}

export function SiteFooter({ year, sections, socials = socialLinks }: SiteFooterProps) {
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
      <ul className="ks-footer-links" aria-label="Elsewhere" data-quiet="">
        {socials.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <p className="ks-footer-copyright">© {year} Kyle Satti</p>
    </footer>
  );
}
