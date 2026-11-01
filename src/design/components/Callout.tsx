import type { ReactNode } from "react";
import { calloutIcons, calloutTitles, type CalloutType } from "../callouts";

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

export function Callout({ type = "note", title, children }: CalloutProps) {
  return (
    <aside className="ks-callout" data-type={type}>
      <p className="ks-callout-title">
        <svg className="ks-callout-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d={calloutIcons[type]} />
        </svg>
        {title ?? calloutTitles[type]}
      </p>
      <div className="ks-callout-body">{children}</div>
    </aside>
  );
}
