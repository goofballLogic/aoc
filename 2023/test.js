export function test(description, expected, strategy) {

    if (strategy) {

        try {
            const actual = strategy(description);
            if (expected !== actual) {

                console.log(" X ", description);
                console.log("\tExpected:", expected, ". Actual:", actual);

            } else {
                console.log(" _/", description);
            }

        } catch (err) {
            console.log("ERR", description);
            console.log(err);
        }

    } else {

        console.log("...", description);

    }
}
