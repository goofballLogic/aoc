Array.prototype.firstOrNull = function (strategy) {

    return this.reduce((found, x, i, xs) => found ?? strategy(x, i, xs), null);

};

Array.prototype.sum = function () {

    return this.reduce((a, b) => a + b, 0);

};

Object.prototype.pipe = function (strategy, n = 1) {

    const total = n;
    let result = this;
    while (n-- > 0) {

        result = strategy(result, total - n - 1);
        if (n && n % 100000 === 0) console.log(n);
    }
    return result;

};

Object.prototype.tee = function (strategy) {

    strategy(this);
    return this;

}

