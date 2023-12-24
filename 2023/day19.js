import { readFileSync } from "node:fs";
import "./evil.js";

const input = 2;
const day = 19;
const raw = readFileSync(`day${day}-input${input}.txt`)
    .toString()
    .split("\n\n")
    .map(section => section.trim().split("\n"))
    ;

const createCode = workflows =>
    workflows
        .map(w => /(.*){(.*)}/.exec(w))
        .reduce((map, [_, name, workflow]) => ({
            ...map,
            [name]: workflow
                .replace(/:/g, " ? ")
                .replace(/,/g, " : ")
                .replace(/(A|R)/g, `"$1"`)
        }), {})
        .pipe(map => {

            let rule = map.in + " ";
            let active;
            do {

                active = false;
                for (const key in map) {

                    if (rule.includes(` ${key} `)) {

                        active = true;
                        rule = rule.replace(` ${key} `, ` ${map[key]} `);

                    }

                }

            } while (active)
            return rule;

        })
    ;


const createProcessor = workflows =>
    createCode(workflows)
        .pipe(code => new Function("{x, m, a, s}", `return (${code}) === "R" ? 0 : x + m + a + s;`))
    ;

const parsePart = code =>
    eval("(" + code.replace(/=/g, ":") + ")")
    ;

const part1 = data =>
    data
        .pipe(([section1, section2]) => [createProcessor(section1), section2])
        .pipe(([processor, section2]) => section2.map(part => processor(parsePart(part))))
        .sum();
;

console.time("Part 1");
console.log("Part 1", part1(raw));
console.timeEnd("Part 1");

/*
        if I have expressions like          <4   >7    >10    <14     and <20
        then I should test numbers      0    4    8     11     14     and  20
        and the associated ranges are   0-3  4-7  8-10  11-13  14-19  and  20...4000

        if I have expressions           [<4] and [>10]
        then I should test numbers      [0,0] (R)   [0,11] (A) [4,0],               [4,11]
        and combinations for each are   11        + 3989       + (11 * (11 + 3989)) + (3989 * (11 + 3989))
*/

const part2 = data =>
    data
        .pipe(([section1]) => createCode(section1))
        .pipe(code => [
            code,
            Array
                .from(code.matchAll(/([xmas])([><])(\d*)/g))
                .map(([_, v, o, n]) =>
                    [v, parseInt(n) + (o === ">" ? 1 : 0)])
                .reduce((map, [v, n]) =>
                    "xmas"
                        .split("")
                        .map((a, i) => map[i].concat(v === a ? n : []))
                    , [[1], [1], [1], [1]]
                )
                .map(arr =>
                    arr
                        .sort((a, b) => a - b)
                        .map((n, i, ns) => [n, (ns[i + 1] || 4001) - 1]))
        ])
        .pipe(([code, [xs, ms, as, ss]]) => {

            const resolve = new Function("{x, m, a, s}", `return ${code};`);
            let i = 0;
            let total = 0;
            for (const [x, xmax] of xs) {
                const xrange = (xmax - x + 1);
                for (const [m, mmax] of ms) {
                    const mrange = (mmax - m + 1);
                    for (const [a, amax] of as) {
                        const arange = (amax - a + 1);
                        for (const [s, smax] of ss) {
                            const srange = (smax - s + 1);
                            if (++i % 100000000 === 0) console.log(i);
                            const AR = resolve({ x, m, a, s });
                            if (AR === "A")
                                total += srange * arange * mrange * xrange;
                        }
                    }
                }
            }
            return total;
        })
    ;

console.time("Part 2");
console.log("Part 2", part2(raw));
console.timeEnd("Part 2");


