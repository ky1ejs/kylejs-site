export interface ChainStep {
  label: string;
  /** Accent outline: a step that produced code or a site. */
  accent?: boolean;
}

export interface ChainProps {
  steps: ChainStep[];
  /** Accessible name for the list, e.g. "How coffee led to code". */
  label?: string;
}

/** How one interest led to the next. Arrows are drawn in CSS. */
export function Chain({ steps, label }: ChainProps) {
  return (
    <ol className="ks-chain" aria-label={label}>
      {steps.map((step) => (
        <li key={step.label}>
          <span className="ks-chain-step" data-accent={step.accent || undefined}>
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
