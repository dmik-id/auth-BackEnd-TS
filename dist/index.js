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
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const token_model_1 = require("./models/token-model");
const user_model_1 = require("./models/user-model");
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        typeorm_1.createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "1235opaq",
            database: "authorization",
            entities: [
                user_model_1.User,
                token_model_1.Token
            ],
            synchronize: true,
            logging: false
        }).then(connection => {
        }).catch(error => console.log(error));
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
});
start();
