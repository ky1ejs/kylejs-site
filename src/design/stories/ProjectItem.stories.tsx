import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProjectItem } from "../components";

const meta = {
  title: "Components/Project item",
  component: ProjectItem,
  args: {
    title: "Linea Micra controller",
    description: "An ESP32-based hardware controller for the Linea Micra.",
    status: "experiment",
    repo: "ky1ejs/linea-micra-controller",
  },
  render: (args) => (
    <ul className="ks-area-items">
      <ProjectItem {...args} />
    </ul>
  ),
} satisfies Meta<typeof ProjectItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithSite: Story = {
  name: "With a site",
  args: {
    title: "lm-mods.fyi",
    description: "Every Linea Micra mod, catalogued in one place.",
    status: "active",
    url: "https://lm-mods.fyi",
    repo: "ky1ejs/lm-mods",
    year: 2026,
  },
};
