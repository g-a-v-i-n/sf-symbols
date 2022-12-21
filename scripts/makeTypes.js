const fs = require("fs");
const { SF_SYMBOLS_VERSION } = require("./constants");

const NAMES = `${__dirname}/../sources/${SF_SYMBOLS_VERSION}/names.txt`;

const names = fs
    .readFileSync(NAMES, { encoding: "utf8", flag: "r" })
    .split(/\r?\n/);

const typesDotJs = `
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
`;

// Save types to disk.
fs.writeFileSync(`src/types.ts`, typesDotJs);
