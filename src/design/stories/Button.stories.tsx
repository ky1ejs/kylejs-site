import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { href: "#", children: "Read the post", variant: "primary" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary", children: "All writing" } };
export const More: Story = { args: { variant: "more", children: "All writing" } };

export const Together: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
      <Button href="#">Read the post</Button>
      <Button href="#" variant="secondary">
        All writing
      </Button>
      <Button href="#" variant="more">
        All writing
      </Button>
    </div>
  ),
};
