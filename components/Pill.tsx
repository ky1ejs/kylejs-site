export const Pill = ({ title, hex }: { title: string; hex: string }) => (
  <div
    style={{ backgroundColor: hex }}
    className="inline-block rounded-lg px-3 py-1"
  >
    {title}
  </div>
);

type PillCollectionProps = {
  titles: string[];
  hex: string;
};

export const PillCollection = ({
  collections,
}: {
  collections: PillCollectionProps[];
  hex: string;
}) => (
  <div className="mt-2 flex flex-wrap gap-2">
    {collections
      .map((collection) =>
        collection.titles.map((title) => (
          <Pill key={title} title={title} hex={collection.hex} />
        )),
      )
      .flat()}
  </div>
);
