import React from "react";
import { SFSymbolProps } from "./types";
import symbols from "./symbols";

function SFSymbol(props: SFSymbolProps) {
  const selectedSymbol = symbols[props.name];

  return (
    <svg
      width={selectedSymbol.width}
      heigh="auto"
      className={props.className}
      viewBox={`0 0 ${selectedSymbol.width} ${selectedSymbol.height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={selectedSymbol.d} fill={props.fill} />
    </svg>
  );
}

SFSymbol.defaultProps = {
  className: "",
  fill: "#000",
  name: "square.dashed",
  style: {},
};
