import type { ReactNode } from "react";

export interface PostListItemProps {
  href: string;
  title: string;
  description?: string;
  /** Mono line above the title: date, reading time, area. */
  meta: ReactNode;
  /** Heading level for the title within the page outline. */
  headingLevel?: 2 | 3;
}

/** One row of a post list. Wrap rows in <ul className="ks-post-list"><li>. */
export function PostListItem({
  href,
  title,
  description,
  meta,
  headingLevel = 2,
}: PostListItemProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <a className="ks-post-item" href={href}>
      <span className="ks-meta">{meta}</span>
      <Heading className="ks-post-item-title">{title}</Heading>
      {description && <p className="ks-post-item-desc">{description}</p>}
    </a>
  );
}
