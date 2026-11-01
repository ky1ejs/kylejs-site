import { marks, type MarkName } from "../marks";

export interface MarkProps {
  name: MarkName;
  /** Rendered width and height in px. Under 20px the mark is line only. */
  size?: number;
  /** Accessible name. Omit for a decorative mark beside a text label. */
  title?: string;
  className?: string;
}

export function Mark({ name, size = 24, title, className }: MarkProps) {
  const { shape, detail } = marks[name];
  return (
    <svg
      className={["ks-mark", className].filter(Boolean).join(" ")}
      data-size={size < 20 ? "sm" : undefined}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path className="ks-mark-shape" d={shape} />
      <path className="ks-mark-detail" d={detail} />
    </svg>
  );
}
