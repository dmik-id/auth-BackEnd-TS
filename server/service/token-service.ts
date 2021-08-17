export{}
const jwt = require('jsonwebtoken');
const {TokenSchema} = require('../models/token-model');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15s'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30s'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token:string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token:string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId:number, refreshToken:string) {
        const tokenData = await TokenSchema.findOne({where:{user: userId}})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await TokenSchema.create({user: userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken:string) {
        const tokenData = await TokenSchema.destroy({where:{refreshToken}})
        return tokenData;
    }

    async findToken(refreshToken:string) {
        const tokenData = await TokenSchema.findOne({where:{refreshToken}})
        return tokenData;
    }
}

module.exports = new TokenService();
