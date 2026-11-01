import type { Meta, StoryObj } from "@storybook/react-vite";
import { AreaBand, AreaCard, MediaPlaceholder } from "../components";

const meta = {
  title: "Components/Area",
  component: AreaBand,
  parameters: { themeLayout: "stack" },
  args: {
    id: "coffee",
    title: "Coffee",
    mark: "coffee",
    meta: "Linea Micra",
    why: "It started because I lived with a Neapolitan in London. It has since cost me a great deal of money and produced four repositories.",
    chain: [
      { label: "bought a Micra" },
      { label: "lm-mods.fyi", accent: true },
      { label: "controller", accent: true },
    ],
    mediaLayout: "side",
    media: <MediaPlaceholder label="Photo — the machine" />,
    items: [
      { kind: "Site", title: "lm-mods.fyi", desc: "Every Linea Micra mod, catalogued in one place.", href: "#" },
      { kind: "Repo", title: "ShotStopper", desc: "iOS companion for the brew-by-weight device.", href: "#" },
    ],
  },
} satisfies Meta<typeof AreaBand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Band: Story = {};

export const BandWithPost: Story = {
  name: "Band with a post",
  args: {
    id: "fishing",
    title: "Fishing",
    mark: "fishing",
    meta: undefined,
    why: "Fly, upstate and out west. The one hobby that hasn't turned into a repo. Yet.",
    chain: undefined,
    media: undefined,
    items: [
      {
        kind: "Post",
        title: "Why I fly fish",
        desc: "Why I keep making time for fly fishing, and how I've come to terms with the harm it does to fish.",
        href: "#",
        writing: true,
      },
    ],
  },
};

export const Cards: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      <AreaCard
        href="#"
        title="Fishing"
        mark="fishing"
        why="Fly, upstate and out west. The one hobby that hasn't turned into a repo. Yet."
        count="1 post"
      />
      <AreaCard
        href="#"
        title="Strength training"
        mark="training"
        why="Ten kilos down over six months, and a lot learned doing it."
        count="1 post"
      />
    </div>
  ),
};
