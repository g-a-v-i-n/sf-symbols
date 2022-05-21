import React from "react";
import { SFSymbolProps } from "./types";
import symbols from "./symbols";

export function SFSymbol(props: SFSymbolProps) {
  const selectedSymbol = symbols[props.weight][props.name];

  return (
    <svg
      width="auto"
      height={selectedSymbol.height}
      className={props.className}
      viewBox={`0 0 ${selectedSymbol.width} ${selectedSymbol.height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={selectedSymbol.d} />
    </svg>
  );
}

SFSymbol.defaultProps = {
  className: "",
  name: "square.dashed",
  style: {},
  weight: "regular",
};
