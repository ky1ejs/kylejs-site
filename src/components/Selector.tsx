import { useState, type ChangeEvent } from "react";

export enum BioState {
  Professional,
  Personal,
}

type SelectorProps = {
  initialState: BioState;
  onChange: (state: BioState) => void;
};

const Selector = ({ initialState, onChange }: SelectorProps) => {
  const [state, setState] = useState(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newState =
      e.target.id === "professional"
        ? BioState.Professional
        : BioState.Personal;
    setState(newState);
    onChange(newState);
  };

  return (
    <div className="selector">
      <input
        type="radio"
        name="bio"
        id="professional"
        checked={state === BioState.Professional}
        onChange={handleChange}
      />
      <label className="font-bold" htmlFor="professional">
        Profesional
      </label>
      <input
        type="radio"
        name="bio"
        id="personal"
        checked={state === BioState.Personal}
        onChange={handleChange}
      />
      <label className="font-bold" htmlFor="personal">
        Personal
      </label>
      <div className="indicator" />
    </div>
  );
};

export default Selector;
