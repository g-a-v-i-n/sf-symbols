const fs = require('fs')
const path = require('path');
const opentype = require('opentype.js');
const SVGPathCommander = require('svg-path-commander');
const weights = require('./constants').WEIGHTS;
const SF_SYMBOLS_VERSION = require('./constants').SF_SYMBOLS_VERSION

// Not sure if this is right
function writeFile(_path, contents, cb) {
    fs.mkdirSync(path.dirname(_path), { recursive: true})
    fs.writeFileSync(_path, contents, cb);
  }

// Paths
const CHARS = `${__dirname}/../sources/${SF_SYMBOLS_VERSION}/chars.txt`
const NAMES = `${__dirname}/../sources/${SF_SYMBOLS_VERSION}/names.txt`

async function main(weight) {
    // Paths
    const OUT = `${__dirname}/../out/${SF_SYMBOLS_VERSION}/${weight.toLowerCase()}.symbols.json`

    // Load SF-Pro of given weight. This script only uses symbols in SF Pro Text, not SF Pro Rounded or compact.
    const font = await opentype.load(
        `${__dirname}/../sources/${SF_SYMBOLS_VERSION}/SF-Pro-Text-${weight}.otf`
    );

    // Load character sequence from text file. 
    // Note that this list is taken via copy/paste from the SF Pro app and the follwoing code assumes all symbols and names are provided in the same order.
    // This also assumes 2 UTF8 chars per symbol, which may change in future versions.
    const chars = fs
        .readFileSync(CHARS, {encoding:'utf-8'})
        .match(/.{1,2}/g);

    // Load name sequence from text file.
    const names = fs
        .readFileSync(NAMES, {encoding:'utf8', flag:'r'})
        .split(/\r?\n/);

    // Gather all geometry information, including SVG paths and bounding boxes. 
    const geometries = chars.map(char => {
        const fontSize = 28;
        const path = font.getPath(char, 0, 0, fontSize);
        const bb = path.getBoundingBox();

        const precision = 2;
        const pathData = path.toPathData(precision);

        // Move symbol to boundary of future container. This may be unwanted by some because it eliminates baseline consistency between symbols.
        const transform = {
            translate: [bb.x1 * -1, bb.y1 * -1], // X and Y axis translation
            origin: [0, 0]
        };

        const transformed2DPathString = new SVGPathCommander(pathData)
            .transform(transform)
            .toString();

        return {
            path: transformed2DPathString,
            boundingBox: {
                x1: 0,
                y1: 0,
                x2: bb.x2 - bb.x1, // Correct for X and Y axis translation
                y2: bb.y2 - bb.y1  // Correct for X and Y axis translation
            },
            fontSize,
            precision,
        };
    })

    // Merged the text, char and geometry arrays
    const zipped = chars.map((char, i) => ({
        char,
        name: names[i],
        geometry: geometries[i],
    }));

    // Sorts symbols into filled and outline versions. Not all symbols have both variants.
    // const sortedSymbols = zipped.reduce((acc, symbol) => {
    //     if (symbol.name.split('.').includes('fill') === true) {
    //         acc = {
    //             ...acc,
    //             solid: [...acc.solid, symbol]
    //         };
    //         return acc;
    //     }
    //     acc = {
    //         ...acc,
    //         outline: [...acc.outline, symbol]
    //     };
    //     return acc;
    // }, {
    //     solid: [],
    //     outline: [],
    // });

    // Write out the symbols as JSON.
    writeFile(OUT, JSON.stringify(zipped, null, 2), () => {})
}

weights.forEach(weight => main(weight))


