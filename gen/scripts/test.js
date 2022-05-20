const fs =  require('fs')
const opentype = require('opentype.js');
const SVGPathCommander = require('svg-path-commander');

const IDX = 140
const VERSION = "17.1d1e1"
const CHARS = `sources/${VERSION}.json`
const OUT_TEST = `svg/${IDX}.svg`
const json = fs.readFileSync(CHARS)
const chars = JSON.parse(json)


const OUTER_WIDTH = 32
const SYMBOL_HEIGHT = 28
const MARGIN = (OUTER_WIDTH - SYMBOL_HEIGHT) / 2


async function make(){
    const font = await opentype.load('fonts/SF-Pro.ttf');
    // Construct a Path object containing the letter shapes of the given text.
    // The other parameters are x, y and fontSize.
    // Note that y is the position of the baseline.
    const path = font.getPath(chars[IDX].char, 0, 0, SYMBOL_HEIGHT)

    const bb = path.getBoundingBox()

    console.log(bb)
    
    const decimalPlaces = 2
    const pathData = path.toPathData(decimalPlaces)

    const scaleFactor = SYMBOL_HEIGHT / (bb.y2 - bb.y1)

    console.log(scaleFactor)

    const transform = {
        scale: [scaleFactor, scaleFactor], // uniform scale on X, Y, Z axis
        translate: [(bb.x1 * -scaleFactor) + MARGIN, (bb.y1 * -scaleFactor) + MARGIN], // X axis translation
        origin: [0, 0]
      }
    
    const transformed2DPathString = new SVGPathCommander(pathData).transform(transform).toString();

    
    const svg = `
        <svg
            width="32px"
            height="32px"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="${transformed2DPathString}" fill="black" />
        </svg>
    `

    fs.writeFileSync(OUT_TEST, svg)
}



make()



// fs.writeFileSync(OUT_TEST, svg, {encoding: 'utf8'})