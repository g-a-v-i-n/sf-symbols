# SF Symbols Bootleg SVG Library

This repo is used to create libraries for SF Symbols.

```bash
pnpm install
```

## 1. Generate Symbol Dictionaries
```bash
node ./gen/scripts/generateSymbols.js
```

Output can be found in `./gen/out`.

## 2. Generate React Library Files
```bash
node ./gen/scripts/generateReactLib.js
```

Output can be found in `./src`.