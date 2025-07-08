"use client";
import { useState, ChangeEvent, useEffect } from "react";
import css from "./Selector.module.css";

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

  // Sync React state with DOM state on mount (handles browser back navigation)
  useEffect(() => {
    const professionalRadio = document.getElementById("professional") as HTMLInputElement;
    const personalRadio = document.getElementById("personal") as HTMLInputElement;
    
    if (professionalRadio && personalRadio) {
      let actualState = initialState;
      
      if (professionalRadio.checked) {
        actualState = BioState.Professional;
      } else if (personalRadio.checked) {
        actualState = BioState.Personal;
      }
      
      if (actualState !== state) {
        setState(actualState);
        onChange(actualState);
      }
    }
  }, [initialState, onChange, state]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newState =
      e.target.id === "professional"
        ? BioState.Professional
        : BioState.Personal;
    setState(newState);
    onChange(newState);
  };

  return (
    <div className={`${css.selector}`}>
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
      <div className={css.indicator} />
    </div>
  );
};

export default Selector;
