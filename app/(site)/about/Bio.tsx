"use client";

import Selector, { BioState } from "@/components/Selector";
import { JSX, useState } from "react";

export default function Bio({
  Professional,
  Personal,
  GitHubStats,
}: {
  Professional: JSX.Element;
  Personal: JSX.Element;
  GitHubStats?: JSX.Element;
}) {
  const [state, setState] = useState(BioState.Professional);

  return (
    <div className="bg-background-secondary mt-4 rounded-[20px] pb-8">
      <Selector initialState={state} onChange={setState} />
      <div className="px-4">
        {state === BioState.Professional ? (
          <div>
            {Professional}
            {GitHubStats}
          </div>
        ) : (
          Personal
        )}
      </div>
    </div>
  );
}
