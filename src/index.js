/**
 * normalize-exponential
 * Normalizes exponential format in float-parseable strings.
 *
 * @author TheoryOfNekomata <allan.crisostomo@outlook.com>
 * @license MIT
 */

(function () {

    /**
     * Trims superfluous zeroes.
     * @param {String} numStr A number string.
     * @returns {String} A number string with leading and trailing zeroes removed.
     */
    function trimZeroes(numStr) {
        numStr = numStr.replace(/^(-)?0+|0+$/g, '$1');

        if (numStr[numStr.length - 1] === '.') {
            numStr += '0';
        }

        if (numStr[0] === '.') {
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
        var decPointIdx, expIndex;

        expStr = expStr.trim().toLowerCase();
        decPointIdx = expStr.indexOf('.');
        expIndex = expStr.indexOf('e');        

        if (decPointIdx < 0) {
            if (expIndex < 0) {
                return expStr + '.0e+0';
            }
            expStr = expStr.slice(0, expIndex) + '.0' + expStr.slice(expIndex);
        }

        if (decPointIdx === 0) {
            if (expIndex < 0) {
                return '0' + expStr + 'e+0';
            }
            expStr = '0' + expStr;
        }

        expIndex = expStr.indexOf('e');

        // Add plus
        if (expStr[expIndex + 1] !== '+' || expStr[expIndex + 1] !== '-') {
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
        var decPointIdx = fBasePart.indexOf('.'),
            decimalPointIdx = decPointIdx < 0 ? fBasePart.length : decPointIdx,
            newDecimalPointIdx = decimalPointIdx + numPlaces;

        fBasePart = fBasePart.replace(/\./, '');

        return trimZeroes(fBasePart.slice(0, newDecimalPointIdx) + '.' + fBasePart.slice(newDecimalPointIdx));
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

            // Right shift is when the base part is less than 1
            isRightShift = fStr.search(/0\./) === 0,
            shiftNumPlaces = 0;

        if (fStr.indexOf('.') < 0) {
            return -(getBasePart(fStr).length - 1);
        }

        for (i = 0; i < fStr.length; i++) {
            if (isRightShift && i > 0) {
                if (fStr[i] === '.') {
                    continue;
                }

                shiftNumPlaces++;

                if (fStr[i] !== '0') {
                    return shiftNumPlaces + 1;
                }
                continue;
            }

            if (fStr[i] === '.') {
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
    module.exports = function normalizeExponential(expStr) {
        var normExpStr = normalizeExpStr(expStr),
            isNegative = normExpStr.indexOf('-') === 0,
            absoluteExpStr = normExpStr.slice(isNegative ? 1 : 0),
            shiftNumPlaces = getShiftNumPlaces(absoluteExpStr),
            basePart = getBasePart(absoluteExpStr),
            expPart = getExpPart(absoluteExpStr);

        return (isNegative ? '-' : '') + shiftBaseDecimalPoint(basePart, shiftNumPlaces) + shiftExponent(expPart, -shiftNumPlaces);
    };
    
})();
