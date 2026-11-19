interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedProps {
  /** Shown before the options and read as the group's name. */
  legend: string;
  /** Radio group name; also what scripts listen to. */
  name: string;
  options: SegmentedOption[];
  /** The option checked on load. */
  value: string;
}

/**
 * A row of mutually exclusive options, built on native radio buttons so it
 * works with the keyboard and screen readers. It holds no state of its own:
 * a page script reads the checked input.
 */
export function Segmented({ legend, name, options, value }: SegmentedProps) {
  return (
    <fieldset className="ks-segmented">
      <legend className="ks-segmented-legend">{legend}</legend>
      <span className="ks-segmented-options">
        {options.map((o) => {
          const id = `${name}-${o.value}`;
          return (
            <span key={o.value} className="ks-segmented-option">
              <input
                type="radio"
                id={id}
                name={name}
                value={o.value}
                defaultChecked={o.value === value}
              />
              <label htmlFor={id}>{o.label}</label>
            </span>
          );
        })}
      </span>
    </fieldset>
  );
}
