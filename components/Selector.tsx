"use client"
import { useState } from "react";
import css from "./Selector.module.css";

export enum BioState {
  Professional,
  Personal
}

type SelectorProps = {
  initialState: BioState;
  onChange: (state: BioState) => void;
}

const Selector = ({ initialState, onChange }: SelectorProps) => {
  const [state, setState] = useState(initialState);

  const hangleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = e.target.id === "professional" ? BioState.Professional : BioState.Personal
    setState(newState);
    onChange(newState);
  }

  return (
    <div className={`${css.selector}`}>
      <input type="radio" name="bio" id="professional" checked={state === BioState.Professional} onChange={hangleChange} />
      <label className="font-bold" htmlFor="professional">Profesional</label>
      <input type="radio" name="bio" id="personal" checked={state === BioState.Personal} onChange={hangleChange} />
      <label className="font-bold" htmlFor="personal">Personal</label>
      <div className={css.indicator} />
    </div>
  )
}

export default Selector;
