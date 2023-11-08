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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientInstance_1 = __importDefault(require("../clientInstance"));
const worker_1 = require("../worker");
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
class User {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usertype = req.body.usertype;
            let newuser = req.body;
            if (req.body.password !== '') {
                const hashpassword = bcrypt.hashSync(newuser.password, 10);
                newuser.password = hashpassword;
            }
            const createdAt = new Date();
            newuser = Object.assign(Object.assign({}, newuser), { createdAt: createdAt, updatedAt: createdAt });
            let user;
            let message = "";
            try {
                if (usertype == "Agent") {
                    user = yield clientInstance_1.default.user.create({ data: newuser });
                    message = "Your account was created successfully";
                }
                else {
                    user = yield clientInstance_1.default.organization.create({ data: newuser });
                    message = "Account created successfuly";
                }
                var token = jwt.sign({
                    id: user.id
                }, process.env.SECRET_KEY, {
                    expiresIn: "1D"
                });
                res.status(200).send({ message: message, auth_token: token, user_id: user.id });
            }
            catch (error) {
                res.status(400).send({ error: error, message: 'bad request' });
            }
        });
    }
    // login function by email or phone which is unique
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usertype = req.query.user_type == 'organization' ? clientInstance_1.default.organization : clientInstance_1.default.user;
            const login_method = req.body.hasOwnProperty('email') ? true : false;
            const password = req.body.password;
            let user = null;
            try {
                if (login_method) {
                    user = yield usertype.findUnique({
                        where: {
                            email: req.body.email
                        }
                    });
                }
                else {
                    user = yield usertype.findUnique({
                        where: {
                            phone: req.body.phone
                        }
                    });
                }
                const isPassword = bcrypt.compareSync(password, user.password);
                if (isPassword) {
                    // auth token initialization
                    var token = jwt.sign({
                        id: user.id
                    }, process.env.SECRET_KEY, {
                        expiresIn: "1D"
                    });
                    res.status(200).send({ user: (0, worker_1.exclude)(user, 'password'), auth_token: token });
                }
                else
                    res.status(400).send({ message: 'Password is incorrect' });
            }
            catch (error) {
                res.status(400).send({ message: "User does not exist." });
            }
        });
    }
    //  id and usertype must be pass to url string for query
    // example '/user?user_type=Agent?user_id=2'
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usertype = req.query.user_type;
            const id = Number(req.query.user_id);
            let user;
            try {
                if (usertype === "agent") {
                    user = yield clientInstance_1.default.user.findUnique({
                        where: {
                            id: id,
                        },
                    });
                }
                if (usertype === "organization") {
                    user = yield clientInstance_1.default.organization.findUnique({
                        where: {
                            id: id,
                        },
                    });
                }
                res.status(200).send({ user: (0, worker_1.exclude)(user, 'password') });
            }
            catch (error) {
                res.status(400).send({ data: { message: 'user does not exist' } });
            }
        });
    }
}
exports.default = User;
//# sourceMappingURL=UserController.js.map