import type { Meta, StoryObj } from "@storybook/react-vite";
import { Byline } from "../components";

const meta = {
  title: "Components/Byline",
  component: Byline,
  args: {
    name: "Kyle Satti",
    href: "#",
    initials: "KS",
    meta: "~7 min read · Posted 4 days ago",
  },
} satisfies Meta<typeof Byline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
