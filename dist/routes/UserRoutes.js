"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controller/UserController"));
const worker_1 = require("../worker");
const router = (0, express_1.Router)();
const userController = new UserController_1.default();
router.post('/user', userController.create); // api url to register user 
router.get('/user', userController.getUser); // api url to fetch all user from db 
router.post('/login', userController.login); // api url to login registered user
router.delete('/user/delete/:id', worker_1.verifyToken, userController.deleteUser); // api url to delete user
router.put('/user/edit/:id', worker_1.verifyToken, userController.updateUserDetails); // api url to edit existing user
exports.default = router;
//# sourceMappingURL=UserRoutes.js.map