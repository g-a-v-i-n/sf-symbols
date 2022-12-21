# SF Symbols SVG Library

[SF Symbols](https://developer.apple.com/design/human-interface-guidelines/foundations/sf-symbols) is the greatest icon set to ever be created, and will likely remain so for the foreseeable future. Unfortunately, Apple has always hated the web...

- This repo is used to convert SF Symbols to SVGs, which can then be used in web projects.
- The SVGs are generated from the SF Symbols font files, and the names are taken from the SF Symbols app.
- All 4,491 symbols in 9 weights are included. Monochrome color mode only.

## Usage

1. If first time, install dependencies.
```bash
pnpm i
```
2. Then, generate the JSON output with SVGs (this will take multiple minutes on an M1 Mac).
```bash
pnpm run make
```
3. Output can be found in `/src`

## Creating a new version

### Place the char and name files into `/sources
1. Download the latest SF Symbols version from [Apple's website](https://developer.apple.com/sf-symbols/).
2. Go to `Edit` > `Select All`
3. Right click on the selection, and press `Copy all {x} symbols`
4. Paste symbols into a file in `sources/{version}/chars.txt`
5. Right click again on the selection, this time press `Copy all {x} names`
6. Paste names into a file in `sources/{version}/names.txt`
### Place the font files into `/sources`
7. Download SF Pro font from [Apple's website](https://developer.apple.com/fonts/).
8. Install the font, and open Font Book app.
9. Find SF Pro, and right click on it. Press `Show in Finder`.
10. Copy `SF-Pro-Text-Ultralight.otf` through `SF-Pro-Text-Black.otf` file into `sources/{version}/` folder.
11. Thats it, now you can run the script below.

### Note on Bounding Boxes

Currently, extra space is trimmed at the 4 outer edges of each symbol. It might be desirable to retain the initial extra spacing to preserve baseline consistency or x-axis overflow. Preserving these properties would make the symbols in this library more similar to the characters in the font.

### Note on License
I do not own nor claim to own SF Symbols. This repo is simply a tool to convert the SF Symbols font into SVGs.