export function test(description, expected, strategy) {

    const consoleDescription = description.includes("\n")
        ? description.replace(/\n/g, "\n    ") + "\n"
        : description;

    if (strategy) {

        try {

            const actual = strategy(description);
            if (areEqual(expected, actual)) {

                console.log("\x1b[32;1m _/\x1b[0m", consoleDescription);

            } else {

                console.log("\x1b[31;1m X \x1b[0m", consoleDescription);
                console.log("\tExpected:", JSON.stringify(expected), ". Actual:", JSON.stringify(actual));
                throw new Error("Tests failed");

            }

        } catch (err) {

            console.log("ERR", consoleDescription);
            console.log(err);

        }

    } else {

        console.log("\x1b[37m___\x1b[0m", consoleDescription);

    }
}

function areEqual(expected, actual) {

    if (Array.isArray(expected) && Array.isArray(actual)) {

        if (expected.length !== actual.length) return false;
        return expected.every((a, i) => areEqual(a, actual[i]));

    } else {

        return expected === actual;

    }

}
