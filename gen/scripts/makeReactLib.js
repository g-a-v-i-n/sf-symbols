const fs = require('fs')
const prettier = require('prettier/standalone')
const babelParser = require('prettier/parser-babel')
const symbols = require("../../out/3/symbols.json")

// Helper used to ensure output is formatted nicely
function formatCodeString(code) {
    return prettier.format(code, { parser: 'babel',  plugins: [babelParser] })
}

// Generate the dictionary of symbols, ie the.symbol.name: {...}
const dict = symbols.reduce((acc, symbol) => {
    acc[symbol.name] = {
        d: symbol.geometry.path,
        width: symbol.geometry.boundingBox.x2,
        height: symbol.geometry.boundingBox.y2,
    }
    return acc
}, {});

// Generate the symbols file. Maybe could be a JSON file instead.
const symbolsDotJs = `
const symbols = ${JSON.stringify(dict, null, 2)};
export default symbols;
`

// Save symbols file to disk.
fs.writeFileSync(`src/symbols.ts`, formatCodeString(symbolsDotJs))

// This doesn't really need to be metaprogrammed but I did it anyway.
const SFSymbolDotJs = `
import React from 'react';
import {SFSymbolProps} from './types';
import symbols from './symbols';

export function SFSymbol(props:SFSymbolProps) {
    
    const selectedSymbol = symbols[props.name];

    return (
        <svg
            width={selectedSymbol.width}
            height="auto"
            className={props.className}
            viewBox={\`0 0 \${selectedSymbol.width} \${selectedSymbol.height}\`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d={selectedSymbol.d}
                fill={props.fill}
            />
        </svg>
    )
}

SFSymbol.defaultProps = {
    className: '',
    fill: '#000',
    name: 'square.dashed',
    style: {},
}
`

// Save symbols react component to disk.
fs.writeFileSync(`src/SFSymbol.tsx`, formatCodeString(SFSymbolDotJs))

// Generate typings
const typesDotJs = `
    import React from 'react';

    export type SFSymbolNames = "${symbols.map(symbol => symbol.name).join(`" | "`)}"

    export type SFSymbolProps = {
        className: string,
        fill?: string,
        style?: React.CSSProperties,
        name: SFSymbolNames,
    }
`

// Save types to disk.
fs.writeFileSync(`src/types.ts`, formatCodeString(typesDotJs))