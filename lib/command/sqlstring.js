
const { Literal } = require('./literals');
const SqlString = require('sqlstring');

const kEscape = Symbol('kEscape');

if (!SqlString[kEscape]) {
    SqlString[kEscape] = SqlString.escape;

    SqlString.escape = (val, stringifyObjects, timeZone) => {
        if (val instanceof Literal) {
            return val.toString();
        }
        return SqlString[kEscape](val, stringifyObjects, timeZone);
    };
}

export { SqlString };