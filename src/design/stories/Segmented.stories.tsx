import type { Meta, StoryObj } from "@storybook/react-vite";
import { Segmented } from "../components";

const meta = {
  title: "Components/Segmented",
  component: Segmented,
  args: {
    legend: "Group",
    name: "story-group",
    value: "topic",
    options: [
      { value: "topic", label: "Topic" },
      { value: "status", label: "Status" },
      { value: "none", label: "None" },
    ],
  },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
