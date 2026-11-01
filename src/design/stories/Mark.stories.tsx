import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mark } from "../components";
import { markNames } from "../marks";

const meta = {
  title: "Components/Mark",
  component: Mark,
  args: { name: "coffee", size: 48 },
  argTypes: {
    name: { control: "select", options: markNames },
    size: { control: { type: "range", min: 12, max: 96, step: 4 } },
  },
} satisfies Meta<typeof Mark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const AllMarks: Story = {
  name: "All marks",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 8 }}>
      {markNames.map((name) => (
        <div
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: "18px 6px 12px",
            background: "var(--ks-surface)",
            border: "1px solid var(--ks-rule)",
            borderRadius: "var(--ks-radius-card)",
          }}
        >
          <Mark name={name} size={32} />
          <span className="ks-label" style={{ fontSize: 9 }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
      {[12, 16, 20, 24, 32, 48].map((size) => (
        <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Mark name="printing" size={size} />
          <span className="ks-meta">{size}</span>
        </div>
      ))}
    </div>
  ),
};
