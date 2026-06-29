"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaterersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const caterer_menu_entity_1 = require("./entities/caterer-menu.entity");
const caterers_service_1 = require("./caterers.service");
const caterers_controller_1 = require("./caterers.controller");
let CaterersModule = class CaterersModule {
};
exports.CaterersModule = CaterersModule;
exports.CaterersModule = CaterersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([caterer_menu_entity_1.CatererMenu])],
        controllers: [caterers_controller_1.CaterersController],
        providers: [caterers_service_1.CaterersService],
        exports: [caterers_service_1.CaterersService],
    })
], CaterersModule);
//# sourceMappingURL=caterers.module.js.map