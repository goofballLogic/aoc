import { readFileSync } from "node:fs";
const filename = "day7-input2.txt";
const raw = readFileSync(filename).toString().trim().split("\n");

console.log(raw.join("\n"));

const [FIVE_OF_A_KIND, FOUR_OF_A_KIND, FULL_HOUSE, THREE_OF_A_KIND, TWO_PAIRS, ONE_PAIR, HIGH_CARD] =
    [200, 190, 180, 170, 160, 150, 100];

const scoreSortedHand = (strategies, hand) =>
    strategies.reduce((score, strategy) => score || strategy(hand), 0);

const scoreHand = (strategies, hand) =>
    scoreSortedHand(strategies, [...hand].sort());

const compareByCardOrder = (cardPowers, xhand, yhand) =>
    xhand.split("").reduce((result, xcard, i) =>
        result || cardPowers.indexOf(xcard) - cardPowers.indexOf(yhand[i]), 0);

(function part1() {

    const scoringStrategies = [
        // five of a kind
        hand => hand[0] === hand[4] ? FIVE_OF_A_KIND : 0,
        // four of a kind
        hand => hand[0] === hand[3] || hand[1] === hand[4] ? FOUR_OF_A_KIND : 0,
        // full house
        hand => hand[0] === hand[1] && hand[3] === hand[4] && (hand[1] === hand[2] || hand[3] === hand[2]) ? FULL_HOUSE : 0,
        // three of a kind
        hand => hand[0] === hand[2] || hand[1] === hand[3] || hand[2] === hand[4] ? THREE_OF_A_KIND : 0,
        // two pairs
        hand => [hand[0] === hand[1], hand[1] === hand[2], hand[2] === hand[3], hand[3] === hand[4]].filter(x => x).length === 2 ? TWO_PAIRS : 0,
        // one pair
        hand => [hand[0] === hand[1], hand[1] === hand[2], hand[2] === hand[3], hand[3] === hand[4]].filter(x => x).length === 1 ? ONE_PAIR : 0,
        // high card
        _hand => HIGH_CARD
    ];

    const cardPowers = "23456789TJQKA";

    const data = raw
        .map(x => x.split(" "))
        .map(([hand, bet]) => [hand, bet, scoreHand(scoringStrategies, hand)])
        .sort(([ahand, _a, ascore], [bhand, _b, bscore]) =>
            (ascore - bscore) || compareByCardOrder(cardPowers, ahand, bhand)) // sort ascending
        .map(([_, bid], i) => parseInt(bid) * (i + 1))
        .reduce((a, b) => a + b)
        ;

    console.log("Part 1", data);

})();


(function part2() {

    const isRunOfFive = hand =>
        hand[0] && hand[0] === hand[4];

    const containsRunOfFour = hand =>
        (hand[0] && hand[0] === hand[3])
        || (hand[1] && hand[1] === hand[4]);

    const containsRunOfThree = hand =>
        (hand[0] && hand[0] === hand[2])
        || (hand[1] && hand[1] === hand[3])
        || (hand[2] && hand[2] === hand[4]);

    const containsRunOfTwo = hand =>
        (hand[0] && hand[0] === hand[1])
        || (hand[1] && hand[1] === hand[2])
        || (hand[2] && hand[2] === hand[3])
        || (hand[3] && hand[3] === hand[4]);

    const scoringStrategies = [

        // five of a kind
        hand => hand.length < 1 // five jokers
            || isRunOfFive(hand)
            ? FIVE_OF_A_KIND : 0,

        // five of a kind via joker
        hand => hand.length < 2 // four or five jokers (automatic)
            || hand.length === 2 && containsRunOfTwo(hand) // three jokers added to a pair
            || hand.length === 3 && containsRunOfThree(hand) // two jokers added to a three
            || hand.length === 4 && containsRunOfFour(hand) // one joker added to four of a kind
            ? FIVE_OF_A_KIND : 0,

        // four of a kind
        hand => hand.length < 2 // four jokers
            || containsRunOfFour(hand)
            ? FOUR_OF_A_KIND : 0,

        // four of a kind via joker
        hand => hand.length < 3 // three, four or five jokers (automatic)
            || hand.length === 3 && containsRunOfTwo(hand)// two jokers added to a pair
            || hand.length === 4 && containsRunOfThree(hand) // one joker added to a three
            ? FOUR_OF_A_KIND : 0,

        // full house
        hand => hand.length > 4
            && hand[0] === hand[1] && hand[3] === hand[4]
            && (hand[1] === hand[2] || hand[3] === hand[2])
            ? FULL_HOUSE : 0,

        // full house via joker
        hand => hand.length === 4 && hand[0] === hand[1] && hand[2] === hand[3] // one joker added to two pairs
            || hand.length === 3 && containsRunOfTwo(hand) // two jokers added to a pair and one other
            // || hand.length < 3 // three jokers (automatic four of a kind)
            ? FULL_HOUSE : 0,

        // three of a kind
        hand => containsRunOfThree(hand)
            ? THREE_OF_A_KIND : 0,

        // three of a kind via joker
        hand => hand.length === 4 && containsRunOfTwo(hand) // one joker
            || hand.length < 4 // two or more jokers (automatic)
            ? THREE_OF_A_KIND : 0,

        // two pairs
        hand => hand.length > 3 &&
            [hand[0] === hand[1], hand[1] === hand[2], hand[2] === hand[3], hand[3] === hand[4]].filter(x => x).length === 2
            ? TWO_PAIRS : 0,

        // two pairs via joker
        hand => hand.length < 5 && containsRunOfTwo(hand) // at least one joker added to a pair and one other
            ? TWO_PAIRS : 0,

        // one pair
        hand => containsRunOfTwo(hand)
            ? ONE_PAIR : 0,

        // one pair via joker
        hand => hand.length < 5 // at least one joker (automatic)
            ? ONE_PAIR : 0,

        // high card
        _hand => HIGH_CARD // no jokers

    ];

    const testScore = (hand, expected) => console.log(hand, scoreHand(scoringStrategies, hand.replace(/J/g, "")), scoreHand(scoringStrategies, hand.replace(/J/g, "")) === expected);

    // testScore("XXXXX");
    // testScore("JXXXX");
    // testScore("XXJXX");
    // testScore("XXJJX");
    // testScore("XXJJJ");
    // testScore("JXJJJ");
    // testScore("JJJJJ");

    // testScore("XXXXA");
    // testScore("JXXXA");
    // testScore("JJXXA");
    // testScore("JJJXA");
    // testScore("JJJJA");

    // testScore("XXXAA");
    // testScore("XJXAA");

    testScore("AAABC", THREE_OF_A_KIND);
    testScore("AAJBC", THREE_OF_A_KIND - 1);
    testScore("AJJBC", THREE_OF_A_KIND - 2);
    testScore("AJJJC", FOUR_OF_A_KIND - 3);

    testScore("AABBC", TWO_PAIRS);
    testScore("AABBJ", FULL_HOUSE - 1);
    testScore("ABCJJ", THREE_OF_A_KIND - 2);

    testScore("AABCD", ONE_PAIR);
    testScore("JABCD", ONE_PAIR - 1);

    testScore("ABCDE", HIGH_CARD)
    testScore("ABCDJ", ONE_PAIR - 1);

    const cardPowers = "J23456789TQKA";

    const data = raw
        .map(x => x.split(" "))
        .map(([hand, bet]) => [hand, bet, scoreHand(scoringStrategies, hand.replace(/J/g, ""))])
        .sort(([ahand, _a, ascore], [bhand, _b, bscore]) =>
            (ascore - bscore) || compareByCardOrder(cardPowers, ahand, bhand)) // sort ascending
        .map(x => console.log(x) || x)
        .map(([_, bid], i) => parseInt(bid) * (i + 1))
        .reduce((a, b) => a + b)
        //.forEach(x => console.log(x))
        ;

    console.log("Part 2", data);

    //AA792
})();
