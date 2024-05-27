"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
var cors = require('cors');
const dotenv = require('dotenv');
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const PropertyRoutes_1 = __importDefault(require("./routes/PropertyRoutes"));
// var corsOptions = {
//     origin: 'http://localhost:4200'
// }
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', UserRoutes_1.default);
app.use('/api/property', PropertyRoutes_1.default);
const port = process.env.PORT;
app.listen(port, () => console.log(`Sever is running on port--> ${port}`));
//# sourceMappingURL=server.js.map