import type { ReactNode } from "react";
import { Pill } from "./Pill";

export type ProjectStatus = "active" | "experiment" | "parked" | "archived";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "Active",
  experiment: "Experiment",
  parked: "Parked",
  archived: "Archived",
};

export interface ProjectItemProps {
  title: string;
  description: string;
  status: ProjectStatus;
  /** GitHub repo as "owner/name". */
  repo?: string;
  /** Live site. When both exist, the title links to the site. */
  url?: string;
  /** Short mono line, e.g. "Swift · 61★ · Mar 2026". */
  meta?: string;
  /** `data-*` attributes for the row, e.g. sort keys for a page script. */
  dataset?: Record<string, string>;
  /** Optional longer note under the description. */
  children?: ReactNode;
}

/** One row on /projects. Wrap rows in <ul className="ks-area-items">. */
export function ProjectItem({
  title,
  description,
  status,
  repo,
  url,
  meta,
  dataset,
  children,
}: ProjectItemProps) {
  const repoUrl = repo ? `https://github.com/${repo}` : undefined;
  const primary = url ?? repoUrl;
  const dataAttributes = Object.fromEntries(
    Object.entries(dataset ?? {}).map(([k, v]) => [`data-${k}`, v]),
  );
  return (
    <li className="ks-area-item" {...dataAttributes}>
      <span className="ks-area-item-head">
        {primary ? (
          <a className="ks-area-item-title" href={primary}>
            {title}
          </a>
        ) : (
          <span className="ks-area-item-title">{title}</span>
        )}
        <Pill accent={status === "active"}>{STATUS_LABEL[status]}</Pill>
        {meta && <span className="ks-meta">{meta}</span>}
      </span>
      <p className="ks-area-item-desc">{description}</p>
      {children && <div className="ks-project-note">{children}</div>}
      {url && repoUrl && (
        <p className="ks-project-links">
          <a href={repoUrl}>Source</a>
        </p>
      )}
    </li>
  );
}
