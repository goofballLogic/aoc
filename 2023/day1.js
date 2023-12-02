import { readFileSync } from "node:fs";

const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const data = readFileSync("day1.txt").toString();

let d1 = null, d2 = null;
let sum = 0;

function foundDigit(char) {
    d2 = parseInt(char);
    if (d1 === null) d1 = d2;
}

function foundWord(word) {
    d2 = words.indexOf(word) + 1;
    if (d1 === null) d1 = d2;
}

function foundLineEnd() {
    sum += (10 * d1 + d2);
    d1 = d2 = null;
}

for (let i = 0; i < data.length; i++) {

    const char = data[i];
    if (char === "\n")
        foundLineEnd();
    else if (char >= "0" && char <= "9")
        foundDigit(char);
    else {
        const word = words.find(w => data.indexOf(w, i) === i);
        if (word) foundWord(word);
    }

}

console.log(sum);
