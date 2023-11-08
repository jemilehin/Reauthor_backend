"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclude = void 0;
function exclude(object, keys) {
    return Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)));
}
exports.exclude = exclude;
//# sourceMappingURL=worker.js.map