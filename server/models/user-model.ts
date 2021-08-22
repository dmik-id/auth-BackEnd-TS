// const {Schema, model} = require('mongoose');

// const UserSchema = new Schema({
//     email: {type: String, unique: true, required: true},
//     password: {type: String, required: true},
//     isActivated: {type: Boolean, default: false},
//     activationLink: {type: String},
// })

// module.exports = model('UserSchema', UserSchema);
// /////////////////////////////////////////////////////////////////
// export{}
// const sequelize = require('../db')
// const {DataTypes} = require('sequelize')

// const UserSchema = sequelize.define('user', {
//     id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//     email: {type: DataTypes.STRING, unique: true,},
//     password: {type: DataTypes.STRING},
//     isActivated: {type: DataTypes.BOOLEAN, default: false},
//     activationLink: {type:DataTypes.STRING},
//     role: {type: DataTypes.STRING, defaultValue: "USER"},
// })


// module.exports = {
//     UserSchema,
// }
////////////////////////////////////////////////////////////////////
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    isActivated: boolean;

    @Column()
    activationLink: string;

    @Column()
    role: string;

}