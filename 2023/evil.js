Array.prototype.firstOrNull = function (strategy) {

    return this.reduce((found, x, i, xs) => found ?? strategy(x, i, xs), null);

};

Array.prototype.distinct = function () {

    return Array.from(new Set(this));

};

Array.prototype.sum = function () {

    return this.reduce((a, b) => a + b, 0);

};

Array.prototype.tee = function (strategy) {

    this.forEach(strategy);
    return this;

}

Object.prototype.pipe = function (strategy, n = 1) {

    const total = n;
    let result = this;
    while (n-- > 0) {

        result = strategy(result, total - n - 1);
        if (n && n % 100000 === 0) console.log(n);
    }
    return result;

};

Object.prototype.tap = function (strategy) {

    strategy(this);
    return this;

}

