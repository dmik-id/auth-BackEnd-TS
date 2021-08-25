export{}
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');
const adminService = require('../service/admin-service')
class AdminController {
    async editUser(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password} = req.body;
            const userData = await adminService.editUser(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AdminController();


