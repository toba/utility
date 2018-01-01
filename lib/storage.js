"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utility_1 = require("./utility");
exports.session = {
    save: function (key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    remove: function (key) {
        sessionStorage.removeItem(key);
    },
    item: function (key) {
        var value = sessionStorage.getItem(key);
        return value !== null ? JSON.parse(value) : null;
    }
};
exports.cookie = {
    save: function (key, value, days, includeSubdomain) {
        if (days === void 0) { days = 0; }
        if (includeSubdomain === void 0) { includeSubdomain = false; }
        var expires = "";
        var domain = includeSubdomain
            ? ""
            : "; domain=." + window.location.hostname;
        if (days != 0) {
            var date = new Date();
            date.setTime(date.getTime() + days * utility_1.Time.Day);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = key + "=" + value + domain + expires + "; path=/";
    },
    item: function (key) {
        var nameEQ = key + "=";
        var pairs = document.cookie.split(";");
        for (var i = 0; i < pairs.length; i++) {
            var kv = pairs[i];
            while (kv.charAt(0) == " ") {
                kv = kv.substring(1, kv.length);
            }
            if (kv.indexOf(nameEQ) == 0) {
                return kv.substring(nameEQ.length, kv.length);
            }
        }
        return null;
    },
    remove: function (key) {
        this.save(key, "", -1);
    }
};
