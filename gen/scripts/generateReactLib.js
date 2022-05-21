const fs = require('fs')
const prettier = require('prettier/standalone')
const babelParser = require('prettier/parser-babel')
const SF_SYMBOLS_VERSION = require('./constants').SF_SYMBOLS_VERSION
const WEIGHTS = require('./constants').WEIGHTS

// Helper used to ensure output is formatted nicely
function formatCodeString(code) {
    return prettier.format(code, { parser: 'babel',  plugins: [babelParser] })
}

const symbolsWithAllWeights = WEIGHTS.reduce((acc, weight) => {
    const symbols = require(
        `${__dirname}/../out/${SF_SYMBOLS_VERSION}/${weight.toLowerCase()}.symbols.json`
    )
    
    acc[weight.toLowerCase()] = symbols
        .reduce((acc2, symbol) => {
            acc2[symbol.name] = {
                d: symbol.geometry.path,
                width: symbol.geometry.boundingBox.x2,
                height: symbol.geometry.boundingBox.y2,
            }
            return acc2
        }, {});

    return acc
}, {});

// Generate the symbols file. Maybe could be a JSON file instead.
const symbolsDotJs = `
// SF Symbols Version: ${SF_SYMBOLS_VERSION}
const symbols = ${JSON.stringify(symbolsWithAllWeights, null, 2)};
export default symbols;
`

// Save symbols file to disk.
fs.writeFileSync(`src/symbols.ts`, formatCodeString(symbolsDotJs))


// This doesn't really need to be metaprogrammed yet here we are.
const SFSymbolDotJs = `
import React from 'react';
import {SFSymbolProps} from './types';
import symbols from './symbols';

export function SFSymbol(props:SFSymbolProps) {
    
    const selectedSymbol = symbols[props.weight][props.name];

    return (
        <svg
            width="auto"
            height={selectedSymbol.height}
            className={props.className}
            viewBox={\`0 0 \${selectedSymbol.width} \${selectedSymbol.height}\`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d={selectedSymbol.d}
            />
        </svg>
    )
}

SFSymbol.defaultProps = {
    className: '',
    name: 'square.dashed',
    style: {},
    weight: 'regular',
}
`

// Save symbols react component to disk.
fs.writeFileSync(`src/SFSymbol.tsx`, formatCodeString(SFSymbolDotJs))


// Generate typings
const NAMES = `${__dirname}/../sources/${SF_SYMBOLS_VERSION}/names.txt`

const names = fs
    .readFileSync(NAMES, {encoding:'utf8', flag:'r'})
    .split(/\r?\n/);

const typesDotJs = `
    import React from 'react';

    export type SFSymbolNames = "${names.join(`" | "`)}"

    export type SFSymbolProps = {
        className: string,
        fill?: string,
        style?: React.CSSProperties,
        name: SFSymbolNames,
        weight: ${WEIGHTS.map(weight => `"${weight.toLowerCase()}"`).join(' | ')},
    }
`

// Save types to disk.
fs.writeFileSync(`src/types.ts`, formatCodeString(typesDotJs))