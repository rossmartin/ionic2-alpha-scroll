"use strict";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var MapToIterable = /** @class */ (function () {
    function MapToIterable() {
    }
    /**
     * @param {?} value
     * @return {?}
     */
    MapToIterable.prototype.transform = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        var /** @type {?} */ result = [];
        if (value.entries) {
            for (var _i = 0, _a = value.entries(); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                result.push({ key: key, value: value });
            }
        }
        else {
            for (var /** @type {?} */ key_1 in value) {
                result.push({ key: key_1, value: value[key_1] });
            }
        }
        return result;
    };
    MapToIterable.decorators = [
        { type: core_1.Pipe, args: [{ name: 'mapToIterable' },] },
    ];
    return MapToIterable;
}());
exports.MapToIterable = MapToIterable;
function MapToIterable_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    MapToIterable.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    MapToIterable.ctorParameters;
}
var CSSEscape = /** @class */ (function () {
    function CSSEscape() {
    }
    /*! https://mths.be/cssescape v1.5.1 by @mathias | MIT license */
    /**
     * @param {?} value
     * @return {?}
     */
    CSSEscape.escape = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        var /** @type {?} */ string = String(value);
        var /** @type {?} */ length = string.length;
        var /** @type {?} */ index = -1;
        var /** @type {?} */ codeUnit;
        var /** @type {?} */ result = '';
        var /** @type {?} */ firstCodeUnit = string.charCodeAt(0);
        while (++index < length) {
            codeUnit = string.charCodeAt(index);
            // Note: there’s no need to special-case astral symbols, surrogate
            // pairs, or lone surrogates.
            // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
            // (U+FFFD).
            if (codeUnit == 0x0000) {
                result += '\uFFFD';
                continue;
            }
            if (
            // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
            // U+007F, […]
            (codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
                // If the character is the first character and is in the range [0-9]
                // (U+0030 to U+0039), […]
                (index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
                // If the character is the second character and is in the range [0-9]
                // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
                (index == 1 &&
                    codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
                    firstCodeUnit == 0x002D)) {
                // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
                result += '\\' + codeUnit.toString(16) + ' ';
                continue;
            }
            if (
            // If the character is the first character and is a `-` (U+002D), and
            // there is no second character, […]
            index == 0 &&
                length == 1 &&
                codeUnit == 0x002D) {
                result += '\\' + string.charAt(index);
                continue;
            }
            // If the character is not handled by one of the above rules and is
            // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
            // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
            // U+005A), or [a-z] (U+0061 to U+007A), […]
            if (codeUnit >= 0x0080 ||
                codeUnit == 0x002D ||
                codeUnit == 0x005F ||
                codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
                codeUnit >= 0x0041 && codeUnit <= 0x005A ||
                codeUnit >= 0x0061 && codeUnit <= 0x007A) {
                // the character itself
                result += string.charAt(index);
                continue;
            }
            // Otherwise, the escaped character.
            // https://drafts.csswg.org/cssom/#escape-a-character
            result += '\\' + string.charAt(index);
        }
        return result;
    };
    return CSSEscape;
}());
exports.CSSEscape = CSSEscape;
//# sourceMappingURL=util-classes.js.map