import type { Meta, StoryObj } from "@storybook/react-vite";
import { AreaRail } from "../components";

const meta = {
  title: "Components/Area rail",
  component: AreaRail,
  parameters: { themeLayout: "stack" },
  args: {
    areas: [
      { id: "coding", label: "Coding", mark: "coding" },
      { id: "3d-printing", label: "Printing", mark: "printing" },
      { id: "electronics", label: "Electronics", mark: "electronics" },
      { id: "keyboards", label: "Keyboards", mark: "keyboards" },
      { id: "coffee", label: "Coffee", mark: "coffee" },
      { id: "photography", label: "Photos", mark: "photography" },
      { id: "fishing", label: "Fishing", mark: "fishing" },
      { id: "outdoors", label: "Outdoors", mark: "outdoors" },
      { id: "strength-training", label: "Training", mark: "training" },
    ],
  },
} satisfies Meta<typeof AreaRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
