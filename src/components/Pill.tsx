import { Pill as DesignPill } from "../design/components";

// MDX overrides for the About page's tech lists. The `hex` colours in the
// content are no longer used: every pill shares the design-system style.

export const Pill = ({ title }: { title: string; hex?: string }) => (
  <DesignPill>{title}</DesignPill>
);

type PillCollectionProps = {
  titles: string[];
  hex?: string;
};

export const PillCollection = ({ collections }: { collections: PillCollectionProps[] }) => (
  <ul className="ks-pill-list mt-2">
    {collections
      .flatMap((collection) => collection.titles)
      .map((title) => (
        <li key={title}>
          <DesignPill>{title}</DesignPill>
        </li>
      ))}
  </ul>
);
