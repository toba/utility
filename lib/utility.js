"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is;
(function (is) {
    is.type = {
        BOOLEAN: "boolean",
        FUNCTION: "function",
        NUMBER: "number",
        OBJECT: "object",
        STRING: "string",
        SYMBOL: "symbol",
        UNDEFINED: "undefined"
    };
    function value(x) { return (x !== undefined && x !== null); }
    is.value = value;
    is.defined = function (obj, field) {
        return value(obj) && obj.hasOwnProperty(field);
    };
    is.empty = function (x) { return !value(x) || x === ""; };
    function number(n) {
        return value(n) && typeof (n) === is.type.NUMBER;
    }
    is.number = number;
    function numeric(n) {
        return integer(n) || /^\d+$/.test(n);
    }
    is.numeric = numeric;
    function integer(n) {
        return value(n) && parseInt(n) === n;
    }
    is.integer = integer;
    is.bigInt = function (n) { return integer(n) && (n < -32768 || n > 32767); };
    function array(x) {
        return value(x) && Array.isArray(x);
    }
    is.array = array;
})(is = exports.is || (exports.is = {}));
var Time;
(function (Time) {
    Time[Time["Second"] = 1000] = "Second";
    Time[Time["Minute"] = 60000] = "Minute";
    Time[Time["Hour"] = 3600000] = "Hour";
    Time[Time["Day"] = 86400000] = "Day";
    Time[Time["Week"] = 604800000] = "Week";
    Time[Time["Year"] = 31536000000] = "Year";
})(Time = exports.Time || (exports.Time = {}));
function merge(base) {
    var additions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        additions[_i - 1] = arguments[_i];
    }
    return additions.reduce(function (existing, add) {
        for (var _i = 0, _a = Object.keys(add); _i < _a.length; _i++) {
            var key = _a[_i];
            var v = add[key];
            var exists = is.defined(existing, key);
            if (is.value(v) || !exists) {
                if (Array.isArray(v) || typeof v != is.type.OBJECT) {
                    existing[key] = v;
                }
                else {
                    existing[key] = merge(existing[key], v);
                }
            }
        }
        return existing;
    }, Object.assign({}, base));
}
exports.merge = merge;
function format(text) {
    var insertions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        insertions[_i - 1] = arguments[_i];
    }
    return insertions.reduce(function (out, insert, i) { return out.replace("$" + (i + 1), insert); }, text);
}
exports.format = format;
function removeItem(list, item) {
    var i = list.indexOf(item);
    if (i >= 0) {
        list.splice(i, 1);
    }
}
exports.removeItem = removeItem;
function eventCoord(e) {
    if (e) {
        if (e instanceof TouchEvent) {
            if (e.changedTouches && e.changedTouches.length > 0) {
                var touch = e.changedTouches[0];
                return { x: touch.clientX, y: touch.clientY };
            }
        }
        else if (e.pageX !== undefined) {
            return { x: e.pageX, y: e.pageY };
        }
    }
    return { x: 0, y: 0 };
}
exports.eventCoord = eventCoord;
function list() {
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    return items.join(", ");
}
exports.list = list;
function randomID(size) {
    if (size === void 0) { size = 7; }
    var chars = [];
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var length = possible.length;
    for (var i = 0; i < size; i++) {
        chars.push(possible.charAt(Math.floor(Math.random() * length)));
    }
    return chars.join("");
}
exports.randomID = randomID;
