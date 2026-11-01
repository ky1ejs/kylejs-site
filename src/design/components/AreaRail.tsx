import { Mark } from "./Mark";
import type { MarkName } from "../marks";

export interface RailArea {
  /** Matches the AreaBand or AreaCard id it jumps to. */
  id: string;
  label: string;
  mark: MarkName;
}

export interface AreaRailProps {
  areas: RailArea[];
}

/** Jump links to each area, sticky under the site header. Scrolls sideways on phones. */
export function AreaRail({ areas }: AreaRailProps) {
  return (
    <nav className="ks-rail" aria-label="Areas">
      <ul className="ks-rail-list">
        {areas.map((area) => (
          <li key={area.id}>
            <a className="ks-rail-link" href={`#${area.id}`}>
              <Mark name={area.mark} size={20} />
              <span>{area.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
