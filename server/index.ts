export{}
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware');
// const sequelize = require('./db')
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Token } from "./models/token-model";
import { User } from "./models/user-model";

const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {

        createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "1235opaq",
            database: "authorization",
            entities: [
                User,
                Token
            ],
            synchronize: true,
            logging: false
        }).then(connection => {
            // here you can start to work with your entities
        }).catch(error => console.log(error));

        // await sequelize.authenticate()
        // await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()
