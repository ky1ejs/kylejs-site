import type { Meta, StoryObj } from "@storybook/react-vite";
import { Callout } from "../components";

const meta = {
  title: "Components/Callout",
  component: Callout,
  args: { type: "note", children: "Context worth knowing that the reader can safely skip." },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Note: Story = {};

export const AllTypes: Story = {
  name: "All types",
  render: () => (
    <div>
      <Callout type="note">Context worth knowing that the reader can safely skip.</Callout>
      <Callout type="tip">A shortcut or a better way to do the thing just described.</Callout>
      <Callout type="warning">Something that will cost time or money if ignored.</Callout>
      <Callout type="caution">Something that can break, hurt or not be undone.</Callout>
    </div>
  ),
};
