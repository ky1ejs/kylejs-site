import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { marks, markNames } from "../marks";
import {
  AreaBand,
  AreaCard,
  Button,
  Byline,
  Callout,
  Chain,
  Mark,
  Pill,
  PostListItem,
  SiteFooter,
  SiteHeader,
  SocialLinks,
  socialLinks,
} from ".";

const html = (node: React.ReactElement) => renderToStaticMarkup(node);

describe("Mark", () => {
  it("draws every mark from its shape and detail paths", () => {
    for (const name of markNames) {
      const out = html(<Mark name={name} />);
      expect(out).toContain(marks[name].shape);
      expect(out).toContain(marks[name].detail);
    }
  });

  it("is decorative unless given a title", () => {
    expect(html(<Mark name="coffee" />)).toContain('aria-hidden="true"');
    const titled = html(<Mark name="coffee" title="Coffee" />);
    expect(titled).toContain('role="img"');
    expect(titled).toContain('aria-label="Coffee"');
    expect(titled).not.toContain("aria-hidden");
  });

  it("switches to line only under 20px", () => {
    expect(html(<Mark name="coffee" size={16} />)).toContain('data-size="sm"');
    expect(html(<Mark name="coffee" size={20} />)).not.toContain("data-size");
  });
});

describe("Button", () => {
  it("is a link with the variant class", () => {
    const out = html(<Button href="/posts" variant="secondary">All writing</Button>);
    expect(out).toMatch(/^<a class="ks-button ks-button-secondary" href="\/posts">/);
  });

  it("adds a hidden arrow to the more variant", () => {
    expect(html(<Button href="/posts" variant="more">All writing</Button>)).toContain(
      '<span aria-hidden="true">→</span>',
    );
  });
});

describe("Pill and Chain", () => {
  it("marks accent pills and draws a small mark", () => {
    const out = html(<Pill accent mark="writing">Post</Pill>);
    expect(out).toContain("data-accent");
    expect(out).toContain('data-size="sm"');
    expect(html(<Pill>Repo</Pill>)).not.toContain("data-accent");
  });

  it("renders steps as an ordered list", () => {
    const out = html(<Chain steps={[{ label: "a" }, { label: "b", accent: true }]} label="Steps" />);
    expect(out).toMatch(/^<ol class="ks-chain" aria-label="Steps">/);
    expect(out.match(/<li>/g)).toHaveLength(2);
  });
});

describe("Byline", () => {
  it("falls back to initials without an avatar", () => {
    expect(html(<Byline name="Kyle Satti" href="/" initials="KS" meta="today" />)).toContain(">KS</a>");
  });

  it("hides the avatar link from assistive tech and keyboard", () => {
    const out = html(<Byline name="Kyle Satti" href="/" initials="KS" meta="today" />);
    expect(out).toContain('aria-hidden="true" tabindex="-1"');
  });
});

describe("PostListItem", () => {
  it("links the whole row and uses the given heading level", () => {
    const out = html(<PostListItem href="/posts/a" title="A" meta="m" headingLevel={3} />);
    expect(out).toMatch(/^<a class="ks-post-item" href="\/posts\/a">/);
    expect(out).toContain('<h3 class="ks-post-item-title">A</h3>');
    expect(out).not.toContain("ks-post-item-desc");
  });
});

describe("Callout", () => {
  it("defaults the title from the type", () => {
    const out = html(<Callout type="warning">x</Callout>);
    expect(out).toContain('data-type="warning"');
    expect(out).toContain("Warning</p>");
  });
});

describe("Areas", () => {
  it("labels the band by its heading", () => {
    const out = html(<AreaBand id="coffee" title="Coffee" mark="coffee" why="w" />);
    expect(out).toContain('aria-labelledby="coffee-title"');
    expect(out).toContain('id="coffee-title"');
  });

  it("gives post items the accent pill with the writing mark", () => {
    const out = html(
      <AreaBand
        title="Fishing"
        mark="fishing"
        why="w"
        items={[{ kind: "Post", title: "Why I fly fish", href: "/posts/why-i-fly-fish", writing: true }]}
      />,
    );
    expect(out).toContain("data-accent");
    expect(out).toContain(marks.writing.shape);
  });

  it("renders a card as a link only when given an href", () => {
    expect(html(<AreaCard title="T" why="w" mark="coffee" href="/x" />)).toMatch(/^<a /);
    expect(html(<AreaCard title="T" why="w" mark="coffee" />)).toMatch(/^<div /);
  });
});

describe("Site chrome", () => {
  it("marks the current section", () => {
    const out = html(<SiteHeader current="about" />);
    expect(out).toContain('<a href="/about" aria-current="page">About</a>');
    expect(out).not.toContain('href="/posts" aria-current');
  });

  it("limits the nav and footer to the given sections", () => {
    expect(html(<SiteHeader sections={["writing", "about"]} />)).not.toContain("/projects");
    expect(html(<SiteFooter year={2026} sections={["writing"]} />)).not.toContain("/about");
  });
});

describe("SocialLinks", () => {
  it("draws each profile's icon in a named 44px link", () => {
    const out = html(<SocialLinks />);
    for (const link of socialLinks) {
      expect(out).toContain(`href="${link.href}" aria-label="${link.label}"`);
      expect(out).toContain(link.icon);
    }
    expect(out.match(/aria-hidden="true"/g)).toHaveLength(socialLinks.length);
  });

  it("is in the footer", () => {
    expect(html(<SiteFooter year={2026} />)).toContain('class="ks-social"');
  });
});
