"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaterersController = void 0;
const common_1 = require("@nestjs/common");
const caterers_service_1 = require("./caterers.service");
const create_caterer_item_dto_1 = require("./dto/create-caterer-item.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let CaterersController = class CaterersController {
    caterersService;
    constructor(caterersService) {
        this.caterersService = caterersService;
    }
    async getMenu() {
        return this.caterersService.getMenu();
    }
    async findOne(id) {
        return this.caterersService.findOne(id);
    }
    async addItem(createDto) {
        return this.caterersService.addItem(createDto);
    }
    async updateItem(id, updateDto) {
        return this.caterersService.updateItem(id, updateDto);
    }
    async deleteItem(id) {
        return this.caterersService.deleteItem(id);
    }
};
exports.CaterersController = CaterersController;
__decorate([
    (0, common_1.Get)('menu'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CaterersController.prototype, "getMenu", null);
__decorate([
    (0, common_1.Get)('menu/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CaterersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.Post)('menu'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_caterer_item_dto_1.CreateCatererItemDto]),
    __metadata("design:returntype", Promise)
], CaterersController.prototype, "addItem", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.Put)('menu/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_caterer_item_dto_1.CreateCatererItemDto]),
    __metadata("design:returntype", Promise)
], CaterersController.prototype, "updateItem", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.Delete)('menu/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CaterersController.prototype, "deleteItem", null);
exports.CaterersController = CaterersController = __decorate([
    (0, common_1.Controller)('caterers'),
    __metadata("design:paramtypes", [caterers_service_1.CaterersService])
], CaterersController);
//# sourceMappingURL=caterers.controller.js.map