const fs = require("fs");
const path = require("path");
const opentype = require("opentype.js");
const SVGPathCommander = require("svg-path-commander");
const {
    WEIGHTS,
    SF_SYMBOLS_VERSION,
    PATH_PRECISION,
    FONT_SIZE,
} = require("./constants");

// Not sure if this is right
function writeFile(_path, contents) {
    fs.mkdirSync(path.dirname(_path), { recursive: true });
    fs.writeFileSync(_path, contents);
}

// Paths
const PATHS = {
    CHARS: `${__dirname}/../sources/${SF_SYMBOLS_VERSION}/chars.txt`,
    NAMES: `${__dirname}/../sources/${SF_SYMBOLS_VERSION}/names.txt`,
    OUT: `${__dirname}/../src/symbolSet.json`,
};

async function make() {
    console.log("Loading Fonts...");

    const fonts = await Promise.all(
        WEIGHTS.map(async (weight) => {
            const font = await opentype.load(
                `${__dirname}/../sources/${SF_SYMBOLS_VERSION}/SF-Pro-Text-${weight}.otf`
            );
            return font;
        })
    );

    console.log("Capturing Paths... This takes a while");

    const chars = fs
        .readFileSync(PATHS.CHARS, { encoding: "utf-8" })
        .match(/.{1,2}/g);

    // Load name sequence from text file.
    const names = fs
        .readFileSync(PATHS.NAMES, { encoding: "utf8", flag: "r" })
        .split(/\r?\n/);

    const out = {
        version: SF_SYMBOLS_VERSION,
        precision: PATH_PRECISION,
        fontSize: FONT_SIZE,
        symbols: names.reduce((acc1, name, namesIndex) => {
            console.log(`${namesIndex + 1}/${names.length} - ${name}`);
            return {
                ...acc1,
                [name]: WEIGHTS.reduce((acc2, weight, index) => {
                    const path = fonts[index].getPath(
                        chars[namesIndex],
                        0,
                        0,
                        FONT_SIZE
                    );
                    const bb = path.getBoundingBox();

                    const pathData = path.toPathData(PATH_PRECISION);

                    // Move symbol to boundary of future container. This may be unwanted by some because it eliminates baseline consistency between symbols.
                    const transform = {
                        translate: [bb.x1 * -1, bb.y1 * -1], // X and Y axis translation
                        origin: [0, 0],
                    };

                    const transformed2DPathString = new SVGPathCommander(
                        pathData
                    )
                        .transform(transform)
                        .toString();

                    return {
                        ...acc2,
                        [weight.toLowerCase()]: {
                            path: transformed2DPathString,
                            geometry: {
                                width: bb.x2 - bb.x1, // Correct for X and Y axis translation
                                height: bb.y2 - bb.y1, // Correct for X and Y axis translation
                            },
                        },
                    };
                }, {}),
            };
        }, {}),
    };

    console.log("Done!");
    writeFile(PATHS.OUT, JSON.stringify(out, null, 2));
}

make();
