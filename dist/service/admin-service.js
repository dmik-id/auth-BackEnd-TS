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
const typeorm_1 = require("typeorm");
const user_model_1 = require("../models/user-model");
const ApiError = require('../exceptions/api-error');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const bcrypt = require('bcrypt');
class AdminService {
    editUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = typeorm_1.getRepository(user_model_1.User);
            const candidate = yield userRepo.findOne({ where: { email } });
            if (candidate) {
                throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
            }
            const hashPassword = yield bcrypt.hash(password, 3);
            const user = yield userRepo.create({ email, password: hashPassword, isActivated: true, role: 'USER' });
            yield userRepo.save(user);
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens(Object.assign({}, userDto));
            yield tokenService.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
}
module.exports = new AdminService();
