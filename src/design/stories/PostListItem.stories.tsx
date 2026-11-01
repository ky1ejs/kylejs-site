import type { Meta, StoryObj } from "@storybook/react-vite";
import { PostListItem } from "../components";

const meta = {
  title: "Components/Post list item",
  component: PostListItem,
  args: {
    href: "#",
    title: "Why I fly fish",
    description: "Why I keep making time for fly fishing, and how I've come to terms with the harm it does to fish.",
    meta: "Oct 28, 2026 · ~7 min read",
  },
} satisfies Meta<typeof PostListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const List: Story = {
  render: () => (
    <ul className="ks-post-list">
      <li>
        <PostListItem
          href="#"
          title="Why I fly fish"
          description="Why I keep making time for fly fishing, and how I've come to terms with the harm it does to fish."
          meta="Oct 28, 2026 · ~7 min read"
        />
      </li>
      <li>
        <PostListItem
          href="#"
          title="Multi-agent spec review"
          description="A method for improving spec-driven development with AI agents by using multiple sub-agents to review and iterate on specs."
          meta="Jan 20, 2026 · ~10 min read"
        />
      </li>
      <li>
        <PostListItem href="#" title="Why blog?" meta="Mar 24, 2025 · ~1 min read" />
      </li>
    </ul>
  ),
};
