import type { ReactNode } from "react";

export interface BylineImage {
  src: string;
  srcSet?: string;
  width: number;
  height: number;
}

export interface BylineProps {
  name: string;
  href: string;
  /** Optimised headshot. In Astro, pass the result of getImage(). */
  avatar?: BylineImage;
  /** Shown when there is no avatar. */
  initials?: string;
  /** Metadata line: reading time and date. */
  meta: ReactNode;
}

export function Byline({ name, href, avatar, initials, meta }: BylineProps) {
  return (
    <div className="ks-byline">
      <a className="ks-byline-avatar" href={href} aria-hidden="true" tabIndex={-1}>
        {avatar ? (
          <img
            src={avatar.src}
            srcSet={avatar.srcSet}
            width={avatar.width}
            height={avatar.height}
            alt=""
            loading="eager"
          />
        ) : (
          initials
        )}
      </a>
      <p className="ks-byline-text">
        <span className="ks-byline-name">
          by <a href={href}>{name}</a>
        </span>
        <span className="ks-meta">{meta}</span>
      </p>
    </div>
  );
}
