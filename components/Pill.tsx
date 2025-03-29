
export const Pill = ({ title, hex }: { title: string, hex: string }) => (
  <div style={{ backgroundColor: hex }} className="rounded-lg px-3 py-1 inline-block">
    {title}
  </div>
)

type PillCollection = {
  titles: string[]
  hex: string
}

export const PillCollection = ({ collections, hex }: { collections: PillCollection[], hex: string }) => (
  <div className="flex gap-2 flex-wrap mt-2">
    {collections.map((collection) => (
      collection.titles.map((title) => (
        <Pill key={title} title={title} hex={collection.hex} />
      ))
    )).flat()}
  </div>
)
