/**
 * normalize-exponential
 * Normalizes exponential format in float-parseable strings.
 *
 * @author TheoryOfNekomata <allan.crisostomo@outlook.com>
 * @license MIT
 */

(function () {

    var config;

    /**
     * Gets the decimal point symbol.
     * @returns {String} The decimal point symbol.
     */
    function getDecimalPoint() {
        return config.decimalPoint;
    }

    /**
     * Trims superfluous zeroes.
     * @param {String} numStr A number string.
     * @returns {String} A number string with leading and trailing zeroes removed.
     */
    function trimZeroes(numStr) {
        var decPoint = getDecimalPoint();

        numStr = numStr.replace(/^(-)?0+|0+$/g, '$1');

        if (numStr[numStr.length - 1] === decPoint) {
            numStr += '0';
        }

        if (numStr[0] === decPoint) {
            numStr = '0' + numStr;
        }

        return numStr;
    }

    /**
     * Gets the base part in a floating point string represented in exponential notation.
     * @param {String} expStr A number string.
     * @returns {String} The base part of the floating point string.
     */
    function getBasePart(expStr) {
        return expStr.slice(0, expStr.indexOf('e'));
    }

    /**
     * Gets the exponent part in a floating point string represented in exponential notation.
     * @param {String} expStr A number string.
     * @returns {String} The exponent part of the floating point string.
     */
    function getExpPart(expStr) {
        return expStr.slice(expStr.indexOf('e'));
    }

    /**
     * Gets the base part in a floating point string represented in exponential notation.
     * @param {String} expStr A number string.
     * @returns {String} The base part of the floating point string.
     */
    function normalizeExpStr(expStr) {
        var decPointIdx, expIndex, decPoint = getDecimalPoint();

        expStr = expStr.trim().toLowerCase();
        decPointIdx = expStr.indexOf(decPoint);
        expIndex = expStr.indexOf('e');        

        if (decPointIdx < 0) {
            if (expIndex < 0) {
                return expStr + decPoint + '0e+0';
            }
            expStr = expStr.slice(0, expIndex) + decPoint + '0' + expStr.slice(expIndex);
            expIndex = expStr.indexOf('e');
        }

        if (decPointIdx === 0) {
            expStr = '0' + expStr;
        }

        if (expIndex < 0) {
            expStr += 'e+0';
        }

        expIndex = expStr.indexOf('e');

        // Add plus
        if (expStr[expIndex + 1] !== '+' && expStr[expIndex + 1] !== '-') {
            expStr = expStr.slice(0, expIndex + 1) + '+' + expStr.slice(expIndex + 1);
        }

        return expStr;
    }

    /**
     * Shifts a floating point string's decimal point to a number of places.
     * @param {String} fBasePart A floating point string.
     * @param {Number} numPlaces The number of places to shift, negative values shift to the left.
     * @returns {String} The floating point string with the shifted decimal point.
     */
    function shiftBaseDecimalPoint(fBasePart, numPlaces) {
        var decPoint = getDecimalPoint();
            decPointIdx = fBasePart.indexOf(decPoint),
            phantomDecPointIdx = decPointIdx < 0 ? fBasePart.length : decPointIdx,
            newDecimalPointIdx = phantomDecPointIdx + numPlaces;

        fBasePart = fBasePart.slice(0, decPointIdx) + fBasePart.slice(decPointIdx + decPoint.length);

        return trimZeroes(fBasePart.slice(0, newDecimalPointIdx) + decPoint + fBasePart.slice(newDecimalPointIdx));
    }

    /**
     * Shifts a floating point string's exponent to a number of places.
     * @param {String} fBasePart A floating point string.
     * @param {Number} numPlaces The value to adjust to the exponent.
     * @returns {String} The floating point string with the adjusted exponent.
     */
    function shiftExponent(fExpPart, numPlaces) {
        var expValue = parseInt(fExpPart.slice(fExpPart.search(/e[+\-]?/) + 2)),
            isNegativeExpValue;

        expValue += numPlaces;
        isNegativeExpValue = expValue < 0;
        expValue = Math.abs(expValue);

        return 'e' + (isNegativeExpValue ? '-' : '+') + expValue;
    }

    /**
     * Gets the number of places to shift superfluous zeroes.
     * @param {String} fStr A number string.
     * @returns {String} A number string with leading and trailing zeroes removed.
     */
    function getShiftNumPlaces(fStr) {
        var i,
            decPoint = getDecimalPoint(),

            // Right shift is when the base part is less than 1
            isRightShift = fStr.indexOf('0' + decPoint) === 0,
            shiftNumPlaces = 0;

        if (fStr.indexOf(decPoint) < 0) {
            return -(getBasePart(fStr).length - 1);
        }

        for (i = 0; i < fStr.length; i++) {
            if (isRightShift && i > 0) {
                if (fStr[i] === decPoint) {
                    continue;
                }

                shiftNumPlaces++;

                if (fStr[i] !== '0') {
                    return shiftNumPlaces + 1;
                }
                continue;
            }

            if (fStr[i] === decPoint) {
                return shiftNumPlaces + 1;
            }

            shiftNumPlaces--;
        }

        return shiftNumPlaces;
    }

    /**
     * Normalizes a floating point string represented in exponential format.
     * @param {String} expStr A number string.
     * @returns {String} A normalized number string.
     */
    function normalizeExponential(expStr) {
        var normExpStr = normalizeExpStr('' + expStr),
            isNegative = normExpStr.indexOf('-') === 0,
            absoluteExpStr = normExpStr.slice(isNegative ? 1 : 0),
            shiftNumPlaces = getShiftNumPlaces(absoluteExpStr),
            basePart = getBasePart(absoluteExpStr),
            expPart = getExpPart(absoluteExpStr);

        return (isNegative ? '-' : '') + shiftBaseDecimalPoint(basePart, shiftNumPlaces) + shiftExponent(expPart, -shiftNumPlaces);
    }

    /**
     * Creates a custom normalizer with configuration.
     * @param {Object} The configuration object.
     * @returns {Function} The normalizer function.
     */
    module.exports = function customNormalizeExponential(theConfig) {
        config = theConfig;
        config.decimalPoint = config.decimalPoint || '.';
        return normalizeExponential;
    };
})();
