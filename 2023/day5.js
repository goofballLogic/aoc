import { readFileSync } from "node:fs";
const filename = "day5-input2.txt";
const raw = readFileSync(filename).toString().trim().split("\n");
console.log(raw.join("\n"));

const appendLineToLastSection = (sections, line) =>
    [...sections.slice(0, sections.length - 1), [...sections[sections.length - 1], line]];

const parseRawSectionLine = (line, accumulatingLines) =>
    line.endsWith(":")
        ? [...accumulatingLines, [line]]
        : appendLineToLastSection(accumulatingLines, line);

const parseRawSeedLine = line =>
    [line.split(":")];

const accumulateRawLines = (accumulating, line, i) =>
    line === ""
        ? accumulating
        : i === 0
            ? parseRawSeedLine(line)
            : parseRawSectionLine(line, accumulating);

const parseLineOfNumbers = line =>
    line.trim().split(" ").map(x => parseInt(x.trim()));

const parseSectionLine = (line, i) =>
    i === 0 ? line : parseLineOfNumbers(line);

const parseSection = x =>
    x.map(parseSectionLine);

const determineMapping = (map, x) =>
    map.find(([_, source, range]) => x >= source && x < source + range) || [0, 0];

const parsed = raw
    .reduce(accumulateRawLines, [])
    .map(parseSection)
    ;

(function part1() {

    const data = parsed.reduce((previous, map, i) =>
        (i === 1 ? previous[1] : previous)
            .map(x => [x, determineMapping(map, x)])
            .map(([x, [dest, source]]) => x - source + dest))
        ;

    console.log("Part 1", Math.min(...data));

}());

const asPairs = (pairs, x, i) =>
    i % 2
        ? [...pairs.slice(0, pairs.length - 1), pairs[pairs.length - 1].concat(x)]
        : pairs.concat([[x]]);

const intersection = ([aStart, aLength], [bStart, bLength]) =>
    (result => result[1] > 0 ? result : null)(
        (start =>
            [start, Math.min(aStart + aLength, bStart + bLength) - start]
        )(Math.max(aStart, bStart))
    )
    ;

const bitsOutside = ([aStart, aLength], [bStart, bLength]) => [
    [aStart, bStart - aStart],
    [bStart + bLength, aStart + aLength - (bStart + bLength)]
].filter(([_, length]) => length > 0);

(function part2() {

    let data = parsed[0][1].reduce(asPairs, []).sort((a, b) => a[0] - b[0]);

    //  for each layer
    parsed.slice(1).forEach(([_layerName, ...layerMaps]) => {
        // for each map in the layer
        //let inputPairs = [...data];
        let outputPairs = [];
        layerMaps.forEach(map => {

            let remainingBits = [];
            // for each input pair
            data.forEach(pair => {
                // split the pair into the bit matching the map and the remaining bits outside the map
                const matching = intersection(pair, map.slice(1));
                if (matching) {

                    // keep the bits outside the match
                    remainingBits = remainingBits.concat(bitsOutside(pair, matching));
                    // transform the bit matching the map and send to next layer
                    const transformed = [[matching[0] + map[0] - map[1], matching[1]]];
                    outputPairs = outputPairs.concat(transformed);

                } else {

                    // did not match
                    remainingBits = remainingBits.concat([pair]);

                }

            });
            // all remaining bits are the new input pairs
            data = remainingBits;

        });
        // concatenate the remaining bits and the transformed bits to be the new input pairs for the next layer
        data = data.concat(outputPairs);

    });
    data = data.map(xs => xs[0]);
    console.log("Part 2", Math.min(...data));

}());

