import type { ReactNode } from "react";
import { Mark } from "./Mark";
import type { MarkName } from "../marks";

export interface PillProps {
  children: ReactNode;
  /** Accent outline: something Kyle wrote or built. */
  accent?: boolean;
  /** 12px line mark before the label, e.g. "writing" on Post pills. */
  mark?: MarkName;
}

export function Pill({ children, accent = false, mark }: PillProps) {
  return (
    <span className="ks-pill" data-accent={accent || undefined}>
      {mark && <Mark name={mark} size={12} />}
      {children}
    </span>
  );
}

export interface PillListProps {
  pills: Array<{ label: string; accent?: boolean; mark?: MarkName }>;
  label?: string;
}

export function PillList({ pills, label }: PillListProps) {
  return (
    <ul className="ks-pill-list" aria-label={label}>
      {pills.map((pill) => (
        <li key={pill.label}>
          <Pill accent={pill.accent} mark={pill.mark}>
            {pill.label}
          </Pill>
        </li>
      ))}
    </ul>
  );
}
