import { getRepository } from "typeorm";
import { User } from "../models/user-model";
export{}


const ApiError = require('../exceptions/api-error');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const bcrypt = require('bcrypt');


class AdminService {
    async editUser(email:string, password:string){

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

}

module.exports = new AdminService();
