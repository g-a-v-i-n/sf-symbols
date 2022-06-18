import React from "react";
import { SymbolProps } from "./types";
import symbolSet from "./symbolSet.json";

export function Symbol(props: SymbolProps) {

  // @ts-ignore
  const selectedSymbol = symbolSet.symbols[props.name][props.weight];

  return (
    <svg
      className={props.className}
      style={props.style}
      viewBox={`0 0 ${selectedSymbol.geometry.width} ${selectedSymbol.geometry.height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill='inherit' d={selectedSymbol.path} fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

Symbol.defaultProps = {
  className: "",
  name: "questionmark.square.dashed",
  style: {},
  weight: "regular",
};
