class TestFailure extends Error {

}

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
                throw new TestFailure("Tests failed");

            }

        } catch (err) {

            if (!(err instanceof TestFailure))
                console.log("ERR", consoleDescription);
            throw err;

        }

    } else {

        if (expected !== undefined) {

            console.log("___", consoleDescription.replace(/\n$/, ""), "-\x1b[36m Expecting:", JSON.stringify(expected), consoleDescription.endsWith("\n") ? "\n\x1b[0m" : "\x1b[0m");

        } else {

            console.log("___", consoleDescription);

        }

    }
}

function areEqual(expected, actual) {

    if (Array.isArray(expected) && Array.isArray(actual)) {

        if (expected.length !== actual.length) return false;
        return expected.every((a, i) => areEqual(a, actual[i]));

    } else if (expected && typeof expected === "object") {

        return Object.keys(expected).every(key => areEqual(expected[key], actual?.[key]));

    } else {

        return expected === actual;

    }

}
