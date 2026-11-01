import type { Meta, StoryObj } from "@storybook/react-vite";
import { Callout } from "../components";

// Post body styles come from prose.css (the `.post` class), not a component.
// The h2 highlighter and h3 squiggle markup matches what the hast plugins emit.
const meta = {
  title: "Foundations/Post prose",
  parameters: { themeLayout: "stack" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Prose: Story = {
  render: () => (
    <div className="post" style={{ maxWidth: "var(--ks-width-text)" }}>
      <h1 className="post-title" style={{ marginTop: 0 }}>
        Why I fly fish
      </h1>
      <article>
        <h2>
          <span className="heading-mark">Reading the water</span>
        </h2>
        <p>
          Most of fly fishing happens before the cast. You stand still, watch where the current folds
          over a rock, and work out where a trout would sit. <strong>That patience transfers.</strong>{" "}
          More in <a href="#">a linked page</a>.
        </p>
        <h3>Seams and pockets</h3>
        <p>
          A seam is the line where fast water meets slow. Set the <code>drift</code> along it and let
          the fly do the work.
        </p>
        <Callout type="tip">Barbless hooks make releasing a fish quicker.</Callout>
        <table>
          <thead>
            <tr>
              <th>Fly</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Parachute Adams</td>
              <td>16</td>
            </tr>
            <tr>
              <td>Pheasant Tail</td>
              <td>18</td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>
  ),
};
