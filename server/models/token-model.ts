// const {Schema, model} = require('mongoose');

// const TokenSchema = new Schema({
//     user: {type: Schema.Types.ObjectId, ref: 'User'},
//     refreshToken: {type: String, required: true},
// })

// module.exports = model('Token', TokenSchema);
export{}
const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const TokenSchema = sequelize.define('TokenSchema', {
    user: {type: DataTypes.INTEGER, ref: 'UserSchema'},
    refreshToken: {type: DataTypes.STRING, required: true},
})



module.exports = {
    TokenSchema,
}