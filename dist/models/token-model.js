"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const TokenSchema = sequelize.define('TokenSchema', {
    user: { type: DataTypes.INTEGER, ref: 'UserSchema' },
    refreshToken: { type: DataTypes.STRING, required: true },
});
module.exports = {
    TokenSchema,
};
