"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paginate = void 0;
function Paginate(page, limit, arr) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const result = arr.slice(startIndex, endIndex);
    return result;
}
exports.Paginate = Paginate;
//# sourceMappingURL=middleware.index.js.map