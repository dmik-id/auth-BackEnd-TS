import { getRepository } from "typeorm";
import { Token } from "../models/token-model";
// import { User } from "../models/user-model";
export{}
const jwt = require('jsonwebtoken');
// const {TokenSchema} = require('../models/token-model');


class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15d'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
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
        const tokenRepo = getRepository(Token)

        const tokenData = await tokenRepo.findOne({where:{user: userId}})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            // const token = tokenRepo.create({user : userId, refreshToken})
            return tokenRepo;
        }
        const token = await tokenRepo.create({user: userId, refreshToken})
        await tokenRepo.save(token)
        return token;
    }

    async removeToken(refreshToken:string) {
        const tokenRepo = getRepository(Token)
        const user = await tokenRepo.findOne(refreshToken);
        const tokenData = await tokenRepo.remove(user)
        return tokenData;
    }

    async findToken(refreshToken:string) {
        const tokenRepo = getRepository(Token)
        const tokenData = await tokenRepo.findOne({refreshToken})
        return tokenData;
    }
}

module.exports = new TokenService();
