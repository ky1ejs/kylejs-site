import type { Meta, StoryObj } from "@storybook/react-vite";
import { themes, status, fonts, space, radius } from "../tokens";

const meta = {
  title: "Foundations",
  parameters: { themeLayout: "stack" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const COLOR_ROLES: Array<[key: keyof (typeof themes)["light"], label: string, cssVar: string]> = [
  ["paper", "Paper", "--ks-paper"],
  ["surface", "Surface", "--ks-surface"],
  ["ink", "Ink", "--ks-ink"],
  ["ink2", "Ink 2", "--ks-ink-2"],
  ["muted", "Muted", "--ks-muted"],
  ["rule", "Rule", "--ks-rule"],
  ["accent", "Accent", "--ks-accent"],
  ["accentText", "Accent text", "--ks-accent-text"],
  ["accentSoft", "Accent soft", "--ks-accent-soft"],
  ["onSoft", "On soft", "--ks-on-soft"],
];

/** Swatches read the CSS variables, so each column shows its own theme. */
export const Colors: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
      {COLOR_ROLES.map(([key, label, cssVar]) => (
        <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              height: 56,
              borderRadius: "var(--ks-radius-control)",
              border: "1px solid var(--ks-rule)",
              background: `var(${cssVar})`,
            }}
          />
          <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
          <code className="ks-meta" style={{ textTransform: "none" }}>
            {cssVar}
          </code>
        </div>
      ))}
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
      {(Object.keys(status.light) as Array<keyof (typeof status)["light"]>).map((name) => (
        <div
          key={name}
          style={{
            padding: 16,
            borderRadius: "var(--ks-radius-control)",
            background: `var(--ks-${name}-bg)`,
            color: `var(--ks-${name}-fg)`,
          }}
        >
          <span className="ks-label" style={{ color: "inherit" }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};

const TYPE_SCALE = [
  { label: "Display · Lexend 800 · 56/1.05", style: { fontFamily: fonts.display, fontSize: 56, lineHeight: 1.05, fontWeight: 800, letterSpacing: "-0.035em" }, text: "I build teams and make things." },
  { label: "H1 · Lexend 800 · 40/1.1", style: { fontFamily: fonts.display, fontSize: 40, lineHeight: 1.1, fontWeight: 800, letterSpacing: "-0.025em", color: "var(--ks-accent-text)" }, text: "Why I fly fish" },
  { label: "Body · system sans · 17/1.65", style: { fontSize: 17, lineHeight: 1.65 }, text: "Standing in moving water forces a kind of attention that a desk never does." },
  { label: "Small · 14/1.5", style: { fontSize: 14, lineHeight: 1.5, color: "var(--ks-muted)" }, text: "Why I keep making time for fly fishing." },
];

export const Type: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {TYPE_SCALE.map((row) => (
        <div key={row.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="ks-label">{row.label}</span>
          <span style={row.style}>{row.text}</span>
        </div>
      ))}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span className="ks-label">Label · mono 500 · 11px · +0.12em</span>
        <span className="ks-label">8 min read · Oct 28, 2026 · Fishing</span>
      </div>
    </div>
  ),
};

export const SpaceAndRadius: Story = {
  name: "Space and radius",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Object.entries(space).map(([step, px]) => (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="ks-meta" style={{ width: 80 }}>
              {step} · {px}px
            </span>
            <span style={{ height: 12, width: px, borderRadius: 3, background: "var(--ks-accent)" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {Object.entries(radius).map(([name, px]) => (
          <div
            key={name}
            className="ks-meta"
            style={{
              width: 120,
              height: 72,
              display: "flex",
              alignItems: "flex-end",
              padding: 12,
              background: "var(--ks-surface)",
              border: "1px solid var(--ks-rule)",
              borderRadius: px,
            }}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  ),
};
