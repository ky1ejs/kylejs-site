import type { ReactNode } from "react";

export interface ButtonProps {
  href: string;
  /** primary: filled. secondary: outlined. more: mono "All writing →" link. */
  variant?: "primary" | "secondary" | "more";
  children: ReactNode;
}

/** A link styled as a button. The site has no in-page actions, only navigation. */
export function Button({ href, variant = "primary", children }: ButtonProps) {
  return (
    <a className={`ks-button ks-button-${variant}`} href={href}>
      {children}
      {variant === "more" && <span aria-hidden="true">→</span>}
    </a>
  );
}
