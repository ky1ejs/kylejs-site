import { Pill } from "./Pill";
import { STATUS_LABEL, type ProjectStatus } from "./ProjectItem";

export interface ProjectCardProps {
  title: string;
  description: string;
  status: ProjectStatus;
  /** GitHub repo as "owner/name". */
  repo?: string;
  /** Live site. When both exist, the card links to the site. */
  url?: string;
  /** Short mono line, e.g. "Swift · 61★ · Mar 2026". */
  meta?: string;
}

/** Strips the scheme and trailing slash: "https://cut.watch/" → "cut.watch". */
const displayHost = (href: string) =>
  href.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** A highlighted project, for the home page's selected work. The whole card links out. */
export function ProjectCard({
  title,
  description,
  status,
  repo,
  url,
  meta,
}: ProjectCardProps) {
  const href = url ?? (repo ? `https://github.com/${repo}` : undefined);
  const body = (
    <>
      <span className="ks-project-card-head">
        <span className="ks-project-card-title">{title}</span>
        <Pill accent={status === "active"}>{STATUS_LABEL[status]}</Pill>
      </span>
      <span className="ks-project-card-desc">{description}</span>
      {meta && <span className="ks-meta">{meta}</span>}
      {href && (
        <span className="ks-project-card-link">{displayHost(href)}</span>
      )}
    </>
  );
  return href ? (
    <a className="ks-project-card" href={href}>
      {body}
    </a>
  ) : (
    <div className="ks-project-card">{body}</div>
  );
}
