import { socialLinks, type SocialLink } from "../socials";

export interface SocialLinksProps {
  links?: SocialLink[];
  /** Icon size in px. The tap target is at least 44px either way. */
  size?: number;
}

/** Brand icons linking to Kyle's profiles. Each link is named by its label. */
export function SocialLinks({ links = socialLinks, size = 20 }: SocialLinksProps) {
  return (
    <ul className="ks-social" aria-label="Elsewhere">
      {links.map((link) => (
        <li key={link.href}>
          <a className="ks-social-link" href={link.href} aria-label={link.label} title={link.label}>
            <svg width={size} height={size} viewBox={link.viewBox} aria-hidden="true">
              <path d={link.icon} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
