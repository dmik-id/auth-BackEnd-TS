"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const UserSchema = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, },
    password: { type: DataTypes.STRING },
    isActivated: { type: DataTypes.BOOLEAN, default: false },
    activationLink: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
});
module.exports = {
    UserSchema,
};
