"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.verifyToken = exports.exclude = void 0;
function exclude(object, keys) {
    return Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)));
}
exports.exclude = exclude;
const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bearerHeader = req.headers["authorization"];
        try {
            if (typeof bearerHeader !== "undefined") {
                const bearerToken = bearerHeader.split(" ")[1];
                jwt.verify(bearerToken, process.env.SECRET_KEY, (err, decoded) => {
                    req.user = decoded;
                    if (typeof decoded !== 'undefined')
                        next();
                    else
                        throw err;
                });
            }
            else
                throw new Error();
        }
        catch (error) {
            res.status(401).send({
                message: 'Unauthorized User Access',
                error: error.message
            });
        }
    });
}
exports.verifyToken = verifyToken;
const multer = require('multer');
const storage = multer.memoryStorage();
exports.upload = multer({ storage: storage });
//# sourceMappingURL=worker.js.map