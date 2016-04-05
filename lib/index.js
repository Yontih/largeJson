var isArray = require('lodash.isarray');
var isObject = require('lodash.isobject');

var DEFAULT_DELIMITER = '\n';
var invalidDelimiters = [',', ':', '"'];

function validateDelimiter(delimiter) {
    return invalidDelimiters.indexOf(delimiter) == -1;
}
/**
 *
 * @param {*} raw
 * @param {String} [delimiter]
 * @param {Function} [reviver]
 * @returns {*}
 */
function parse(raw, delimiter, reviver) {
    if (!raw) {
        return null;
    }
    if (delimiter && !validateDelimiter(delimiter)) {
        throw new Error('Invalid Delimiter');
    }
    raw = raw.toString(); // normalize the raw - data (from buffer to string, etc)
    var rawArray = raw.trim().split(delimiter || DEFAULT_DELIMITER);
    return rawArray.map(function (item) {
        return JSON.parse(item, reviver);
    });
}

function stringifyArray(arr, delimiter, replacer, space) {
    return arr.map(function (item) {
        return JSON.stringify(item, replacer, space);
    }).join(delimiter || DEFAULT_DELIMITER);
}

/**
 *
 * @param {*} value
 * @param {String} [delimiter]
 * @param {Function} [replacer]
 * @param {Number|String} [space]
 */
function stringify(value, delimiter, replacer, space) {
    if (!validateDelimiter(delimiter)) {
        throw new Error('Invalid Delimiter');
    }
    if (!value) {
        return "";
    }
    if (isArray(value)) {
        return stringifyArray(value, delimiter, replacer, space)
    }
    if (isObject(value)) {
        return JSON.stringify(value, replacer, space);
    }
    throw new Error('Invalid JSON');
}

module.exports = {
    parse: parse,
    stringify: stringify
};