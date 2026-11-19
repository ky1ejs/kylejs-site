import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProjectCard } from "../components";

const meta = {
  title: "Components/Project card",
  component: ProjectCard,
  args: {
    title: "Cut",
    description:
      "An app for viewing the latest movies, remembering the ones you love and the ones you want to see.",
    status: "active",
    repo: "ky1ejs/cut-ios",
    url: "https://cut.watch",
  },
  render: (args) => (
    <div style={{ display: "flex", maxWidth: 280 }}>
      <ProjectCard {...args} />
    </div>
  ),
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const RepoOnly: Story = {
  name: "Repo only",
  args: {
    title: "Orca",
    description: "Manage projects and agents in a single UI.",
    status: "experiment",
    url: undefined,
    repo: "ky1ejs/orca",
  },
};
