# SF Symbols SVG Library*

This repo is used to create libraries for SF Symbols for use on the web, or anywhere SVG is supported. It's main focus is a React library.

```bash
pnpm install
```

Generally, one should generate the symbols dictionary and then generate the React libary files.

### Generate Symbol Dictionaries
```bash
node ./gen/scripts/generateSymbols.js
```

Output can be found in `./gen/out/<SF Symbols version>`.

### Generate React Library Files
```bash
node ./gen/scripts/generateReactLib.js
```

Output can be found in `./src`.

### Note on Bounding Boxes

I'm undecided about how to proceed with the outer bounding box of the symbols. Currently, extra space is trimmed at the 4 outer edges of each symbol. It might be desirable to retain the initial extra spacing to preserve baseline consistency or x-axis overflow. Preserving these properties would make the symbols in this library more similar to the characters in the font.

*plz dont sue me :(((
