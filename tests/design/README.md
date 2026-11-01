# Design system tests

These run against the built Storybook (`pnpm build-storybook`), one story at a time.

- **Accessibility:** every story, in light and in dark, is checked with axe against WCAG 2.1 A and AA. A token change that drops text contrast below 4.5:1 fails here and in `src/design/tokens.test.ts`.
- **Screenshots:** every story, both themes side by side, at 1280px and 390px wide. They run on Linux only, where the reference images are made. A story without a reference image in `__screenshots__/` is skipped, not failed. The images are PNGs, so Git LFS stores them like the repo's other images.

## Creating or updating reference images

Generate them in CI, not on a Mac: fonts render differently across operating systems, so local images would fail every CI run.

1. Push your branch.
2. In GitHub, open **Actions → Update design screenshots → Run workflow** and pick the branch.
3. The workflow commits the new images to the branch and starts the **Design system** workflow on that commit to compare against them. Review the images in the PR diff.

It refuses to run on `main` or a tag: open a branch.

## Running locally

```sh
pnpm build-storybook
pnpm test:design            # accessibility; on Linux, screenshots that have reference images
pnpm storybook              # browse the components at http://localhost:6006
```
