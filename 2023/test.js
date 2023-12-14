export function test(description, expected, strategy) {

    const consoleDescription = description.includes("\n")
        ? description.replace(/\n/g, "\n    ") + "\n"
        : description;

    if (strategy) {

        try {

            const actual = strategy(description);
            if (expected !== actual) {

                console.log(" X ", consoleDescription);
                console.log("\tExpected:", expected, ". Actual:", actual);

            } else {
                console.log(" _/", consoleDescription);
            }

        } catch (err) {

            console.log("ERR", consoleDescription);
            console.log(err);

        }

    } else {

        console.log("___", consoleDescription);

    }
}
