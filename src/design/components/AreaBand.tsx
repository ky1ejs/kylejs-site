import type { ReactNode } from "react";
import { Mark } from "./Mark";
import { Pill } from "./Pill";
import { Chain, type ChainStep } from "./Chain";
import type { MarkName } from "../marks";

export interface AreaItem {
  kind: string;
  title: string;
  desc?: string;
  href?: string;
  /** Marks the item as a post: accent pill with the writing mark. */
  writing?: boolean;
  /** Accent pill without the writing mark, e.g. an active project. */
  accent?: boolean;
  /** Short mono line after the title, e.g. "Swift · Mar 2026". */
  meta?: string;
}

export interface AreaBandProps {
  id?: string;
  title: string;
  mark: MarkName;
  why: string;
  /** Short right-aligned label, e.g. "Linea Micra". */
  meta?: string;
  chain?: ChainStep[];
  /** Photos or placeholders. Render with MediaPlaceholder or <img>. */
  media?: ReactNode;
  /** "side" puts media beside the items from 720px; otherwise media stacks above. */
  mediaLayout?: "side" | "stack";
  items?: AreaItem[];
  headingLevel?: 2 | 3;
}

export function AreaBand({
  id,
  title,
  mark,
  why,
  meta,
  chain,
  media,
  mediaLayout = "stack",
  items = [],
  headingLevel = 2,
}: AreaBandProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section
      className="ks-area-band"
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <Mark name={mark} size={48} />
      <div className="ks-area-band-body">
        <div className="ks-area-band-head">
          <Heading
            className="ks-area-band-title"
            id={id ? `${id}-title` : undefined}
          >
            {title}
          </Heading>
          {meta && <span className="ks-label">{meta}</span>}
        </div>
        <p className="ks-area-band-why">{why}</p>
        {chain && chain.length > 0 && (
          <Chain
            steps={chain}
            label={`How ${title.toLowerCase()} led to projects`}
          />
        )}
        {(media || items.length > 0) && (
          <div
            className="ks-area-band-content"
            data-media={media ? mediaLayout : undefined}
          >
            {media}
            {items.length > 0 && (
              <ul className="ks-area-items">
                {items.map((item) => (
                  <li className="ks-area-item" key={item.title}>
                    <span className="ks-area-item-head">
                      <Pill
                        accent={item.writing || item.accent}
                        mark={item.writing ? "writing" : undefined}
                      >
                        {item.kind}
                      </Pill>
                      {item.href ? (
                        <a className="ks-area-item-title" href={item.href}>
                          {item.title}
                        </a>
                      ) : (
                        <span className="ks-area-item-title">{item.title}</span>
                      )}
                      {item.meta && (
                        <span className="ks-meta">{item.meta}</span>
                      )}
                    </span>
                    {item.desc && (
                      <p className="ks-area-item-desc">{item.desc}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export function MediaPlaceholder({ label }: { label: string }) {
  return <div className="ks-media-placeholder">[{label}]</div>;
}
