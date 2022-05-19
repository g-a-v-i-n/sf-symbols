const fs =  require('fs')
const pkg = require('../package.json')

const VERSION = "17.1d1e1"

const CHARS = `sources/${VERSION}.chars.txt`;
const NAMES = `sources/${VERSION}.names.txt`;

const chars = fs
    .readFileSync(CHARS, {encoding:'utf-8'})
    .match(/.{1,2}/g)

console.log(chars.length)

const names = fs
    .readFileSync(NAMES, {encoding:'utf8', flag:'r'})
    .split(/\r?\n/)
    .map(dotCaseToCamelCase)

console.log('names: ', names.length, 'chars: ', chars.length)

const zipped = chars.map((char, i) => ({
    char,
    name: names[i]
}))


const json = JSON.stringify(zipped, null, 2)

fs.writeFileSync(`out/${VERSION}.json`, json)

function dotCaseToCamelCase(str) {
    return str
        .split('.')
        .map((term, i) => i === 0 ? term : term.charAt(0).toUpperCase() + term.slice(1))
        .join('')
}


