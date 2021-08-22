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
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
class UserService {
    registration(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = typeorm_1.getRepository(user_model_1.User);
            const candidate = yield userRepo.findOne({ where: { email } });
            if (candidate) {
                throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
            }
            const hashPassword = yield bcrypt.hash(password, 3);
            const activationLink = uuid.v4();
            const user = userRepo.create({ email, password: hashPassword, activationLink, isActivated: true, role: 'ADMIN' });
            yield userRepo.save(user);
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens(Object.assign({}, userDto));
            yield tokenService.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = typeorm_1.getRepository(user_model_1.User);
            const user = yield userRepo.findOne({ where: { email } });
            if (!user) {
                throw ApiError.BadRequest('Пользователь с таким email не найден');
            }
            const isPassEquals = yield bcrypt.compare(password, user.password);
            if (!isPassEquals) {
                throw ApiError.BadRequest('Неверный пароль');
            }
            const userDto = new UserDto(user);
            console.log("fuck", userDto, "OMG");
            const tokens = tokenService.generateTokens(Object.assign({}, userDto));
            yield tokenService.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield tokenService.removeToken(refreshToken);
            return token;
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw ApiError.UnauthorizedError();
            }
            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = yield tokenService.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                throw ApiError.UnauthorizedError();
            }
            const userRepo = typeorm_1.getRepository(user_model_1.User);
            const user = yield userRepo.findOne(userData.id);
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens(Object.assign({}, userDto));
            yield tokenService.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = typeorm_1.getRepository(user_model_1.User);
            const users = yield userRepo.find();
            return users;
        });
    }
}
module.exports = new UserService();
