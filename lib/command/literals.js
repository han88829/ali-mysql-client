class Literal {
    #text;
    constructor(text) {
        this.#text = text;
    }

    toString() {
        return this.#text;
    }
}

module.exports = {
    now: new Literal('now()'),
    Literal,
};