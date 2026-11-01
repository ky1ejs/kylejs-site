import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pill, PillList, Chain } from "../components";

const meta = {
  title: "Components/Pill",
  component: Pill,
  args: { children: "Repo" },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Post: Story = { args: { children: "Post", accent: true, mark: "writing" } };

export const Kinds: Story = {
  render: () => (
    <PillList
      label="Kinds"
      pills={[
        { label: "Post", accent: true, mark: "writing" },
        { label: "Repo" },
        { label: "Site" },
        { label: "Print" },
        { label: "App" },
      ]}
    />
  ),
};

export const ChainOfProjects: Story = {
  name: "Chain",
  render: () => (
    <Chain
      label="How coffee led to code"
      steps={[
        { label: "bought a Micra" },
        { label: "lm-mods.fyi", accent: true },
        { label: "controller", accent: true },
        { label: "Dialed In", accent: true },
      ]}
    />
  ),
};
