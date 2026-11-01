import { Mark } from "./Mark";
import type { MarkName } from "../marks";

export interface AreaCardProps {
  title: string;
  why: string;
  mark: MarkName;
  /** e.g. "1 post". */
  count?: string;
  /** Link to the area. Without it the card is not interactive. */
  href?: string;
}

/** Compact form of an area, for those ranked below the full bands. */
export function AreaCard({ title, why, mark, count, href }: AreaCardProps) {
  const body = (
    <>
      <Mark name={mark} size={32} />
      <span className="ks-area-card-text">
        <span className="ks-area-card-title">{title}</span>
        <span className="ks-area-card-why">{why}</span>
        {count && <span className="ks-area-card-count">{count}</span>}
      </span>
    </>
  );
  return href ? (
    <a className="ks-area-card" href={href}>
      {body}
    </a>
  ) : (
    <div className="ks-area-card">{body}</div>
  );
}
