import { getRepository } from "typeorm";
import { User } from "../models/user-model";

export{}
const bcrypt = require('bcrypt');
// const uuid = require('uuid');
// const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email:string, password:string) {
        const userRepo = getRepository(User)
        const candidate = await userRepo.findOne({where: {email}})
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        // const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

        const user = await userRepo.create({email, password: hashPassword, isActivated:true, role:'USER'})
        await userRepo.save(user)
        // const user = await UserSchema.create({email, password: hashPassword, activationLink})
        // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        

        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});
        
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    // async activate(activationLink) {
    //     const user = await UserSchema.findOne({where: {activationLink}})
    //     if (!user) {
    //         throw ApiError.BadRequest('Неккоректная ссылка активации')
    //     }
    //     user.isActivated = true;
    //     await user.save();
    // }

    async login(email:string, password:string) {
        const userRepo = getRepository(User)
        const user = await userRepo.findOne({where:{email}})
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        
        const userDto = new UserDto(user);
        console.log( userDto )
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken:string) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken:string) {
        if (!refreshToken) {
             throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const userRepo = getRepository(User)
        const user = await userRepo.findByIds(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const userRepo = getRepository(User)
        const users = await userRepo.find();
        return users;
    }
}

module.exports = new UserService();
