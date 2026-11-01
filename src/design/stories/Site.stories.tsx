import type { Meta, StoryObj } from "@storybook/react-vite";
import { SiteHeader, SiteFooter } from "../components";

const meta = {
  title: "Components/Site chrome",
  component: SiteHeader,
  parameters: { themeLayout: "stack" },
  args: { current: "writing" },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const themeButton = (
  <button type="button" className="ks-icon-button" aria-label="Change theme">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  </button>
);

export const Header: Story = {
  render: (args) => <SiteHeader {...args}>{themeButton}</SiteHeader>,
};

export const Footer: Story = {
  render: () => <SiteFooter year={2026} />,
};
