"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weekday_1 = require("./weekday");
var Frequency;
(function (Frequency) {
    Frequency[Frequency["YEARLY"] = 0] = "YEARLY";
    Frequency[Frequency["MONTHLY"] = 1] = "MONTHLY";
    Frequency[Frequency["WEEKLY"] = 2] = "WEEKLY";
    Frequency[Frequency["DAILY"] = 3] = "DAILY";
    Frequency[Frequency["HOURLY"] = 4] = "HOURLY";
    Frequency[Frequency["MINUTELY"] = 5] = "MINUTELY";
    Frequency[Frequency["SECONDLY"] = 6] = "SECONDLY";
})(Frequency = exports.Frequency || (exports.Frequency = {}));
exports.Days = {
    MO: new weekday_1.default(0),
    TU: new weekday_1.default(1),
    WE: new weekday_1.default(2),
    TH: new weekday_1.default(3),
    FR: new weekday_1.default(4),
    SA: new weekday_1.default(5),
    SU: new weekday_1.default(6)
};
//# sourceMappingURL=types.js.map