const fs = require("fs");
const prettier = require("prettier/standalone");
const babelParser = require("prettier/parser-babel");
const SF_SYMBOLS_VERSION = require("./constants").SF_SYMBOLS_VERSION;

// Helper used to ensure output is formatted nicely
function formatCodeString(code) {
  return code
    // return prettier.format(code, { parser: 'babel',  plugins: [babelParser] })
}

// Generate typings
const NAMES = `${__dirname}/../sources/${SF_SYMBOLS_VERSION}/names.txt`;

const names = fs
    .readFileSync(NAMES, { encoding: "utf8", flag: "r" })
    .split(/\r?\n/);

const typesDotJs = `
    import React from 'react';

    export type SFSymbolNames = "${names.join(`" | "`)}"

    export type CharEntry = {
        path: string,
        geometry: { width: number, height: number }
      }
      
      export type SymbolEntry = {
        black: CharEntry,
        bold: CharEntry,
        heavy: CharEntry,
        light: CharEntry,
        medium: CharEntry,
        regular: CharEntry,
        semibold: CharEntry,
        thin: CharEntry,
        ultralight: CharEntry,
      }

      export type SymbolSet = {
        version: string,
        precision: number,
        fontSize: number,
        symbols: { [key in SFSymbolNames]: SymbolEntry }
      }

      export type SymbolProps = {
        className: string,
        fill?: string,
        style?: React.CSSProperties,
        name: SFSymbolNames,
        weight:
          'black'
          | 'bold'
          | 'heavy'
          | 'light'
          | 'medium'
          | 'regular'
          | 'semibold'
          | 'thin'
          | 'ultralight'

    }
`;

// Save types to disk.
fs.writeFileSync(`src/types.ts`, formatCodeString(typesDotJs));

// Copies symbols to react src
fs.copyFileSync(
  `gen/out/${SF_SYMBOLS_VERSION}/symbols.json`,
  `src/symbolSet.json`, 
  fs.constants.COPYFILE_FICLONE
)