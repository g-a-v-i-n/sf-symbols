import React from "react";

import { symbolSet, SFSymbolNames } from "./symbolSet.json";

export type SymbolProps = {
    name: SFSymbolNames;
    weight:
        | "black"
        | "bold"
        | "heavy"
        | "light"
        | "medium"
        | "regular"
        | "semibold"
        | "thin"
        | "ultralight";
};

export function Symbol({ name, weight, ...props }: SymbolProps) {
    // @ts-ignore
    const selectedSymbol = symbolSet.symbols[name][weight];

    return (
        <svg
            viewBox={`0 0 ${selectedSymbol.geometry.width} ${selectedSymbol.geometry.height}`}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fill="inherit"
                d={selectedSymbol.path}
                fillRule="evenodd"
                clipRule="evenodd"
            />
        </svg>
    );
}

Symbol.defaultProps = {
    name: "questionmark.square.dashed",
    weight: "regular",
};
