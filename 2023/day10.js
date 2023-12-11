import { readFileSync } from "node:fs";
const input = 2;
const day = 10;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split("\n");

const navigableFromTheSouth = "S|7F";
const navigableFromTheNorth = "S|JL";
const navigableFromTheWest = "S-J7";
const navigableFromThEast = "S-LF";

const ifNavigable = (allowed, destination) =>
    destination && allowed.includes(destination.pipe) && destination;


function connect(node, graph) {

    const { x, y } = node;
    const N = ifNavigable(navigableFromTheSouth, graph[y - 1]?.[x]);
    const S = ifNavigable(navigableFromTheNorth, graph[y + 1]?.[x]);
    const W = ifNavigable(navigableFromThEast, graph[y]?.[x - 1]);
    const E = ifNavigable(navigableFromTheWest, graph[y]?.[x + 1]);
    switch (node.pipe) {
        case "J":
            node.edges = [N, W].filter(x => x);
            break;
        case "L":
            node.edges = [N, E].filter(x => x);
            break;
        case "-":
            node.edges = [W, E].filter(x => x);
            break;
        case "|":
            node.edges = [N, S].filter(x => x);
            break;
        case "7":
            node.edges = [W, S].filter(x => x);
            break;
        case "F":
            node.edges = [E, S].filter(x => x);
            break;
        case "S":
            node.edges = [N, S, E, W].filter(x => x);
            break;
    }
    return node;

}

(function part1() {

    const data =
        raw
            .map(line => line.split(""))
            .map((line, y) => line.map((pipe, x) => ({ x, y, pipe })))
            .map((line, _, graph) => line.map(node => connect(node, graph)))
            .flatMap(lines => lines);
    ;

    const start = data.find(node => node.pipe === "S");

    let next = [
        1, // number of steps
        start, // form
        start.edges[0] // to
    ];
    while (next[2] !== start)
        next =
            [
                next[0] + 1, // number of steps
                next[2], // from
                next[2].edges.find(edge => edge !== next[1]) // to
            ];

    console.log("Part 1", next[0] / 2);

}());

(function part2() {

    const hbridge = (w, e) => "SLF-".includes(w) && "S7J-".includes(e) ? "-" : ".";
    const vbridge = (n, s) => "SF7|".includes(n) && "SLJ|".includes(s) ? "|" : ".";
    const data =
        raw
            .map(line => line.split(""))
            .map((line, y) => line.flatMap((pipe, x) => [
                { x: x * 2, y, pipe },
                { x: (x * 2) + 1, y, pipe: hbridge(pipe, line[x + 1]), isFake: true }
            ]))
            .flatMap((line, y, lines) => [
                line.map(node => ({ ...node, y: y * 2 })),
                line.map((node, x) => ({ ...node, y: y * 2 + 1, pipe: vbridge(node.pipe, lines[y + 1]?.[x].pipe), isFake: true }))
            ])
            .map((line, _, graph) => line.map(node => connect(node, graph)))
        ;

    const start = data.flatMap(line => line).find(node => node.pipe === "S");

    let next = [
        start, // form
        start.edges[0] // to
    ];
    start.isPath = true;
    while (next[1] !== start) {

        next[1].isPath = true;
        next = [
            next[1], // from
            next[1].edges.find(edge => edge !== next[0]) // to
        ];

    }
    console.log(start);

    data.forEach(line => line.forEach(node => {

        if (!node.isPath) node.pipe = "."

    }));


    console.log(
        data
            .map(line => line
                //.filter(node => !node.isFake)
                .map(node => node.isPath ? " " : node.pipe)
                .join(""))
            .filter(x => x)
            .join("\n"));

    let updated;
    do {

        updated = false;
        data.forEach((line, y) =>

            line.forEach((node, x) => {

                if (node.pipe === ".") {

                    const neighbours = [
                        data[y - 1]?.[x].pipe,
                        data[y + 1]?.[x].pipe,
                        data[y][x - 1]?.pipe,
                        data[y][x + 1]?.pipe
                    ];

                    if (neighbours.some(n => n === "O" || n === undefined)) {

                        updated = true;
                        node.pipe = "O";

                    }

                }

            })

        );

    } while (updated);

    console.log(
        data
            .map(line => line
                //.filter(node => !node.isFake)
                .map(node => node.isPath ? " " : node.pipe)
                .join(""))
            .filter(x => x)
            .join("\n")
    );

    const count = data
        .flatMap(line => line)
        .filter(node => node.pipe === "." && !node.isFake)
        .length
        ;


    console.log(count);
    //console.log(data);

}());
