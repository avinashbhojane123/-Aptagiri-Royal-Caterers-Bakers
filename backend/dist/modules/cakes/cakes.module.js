"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CakesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cake_entity_1 = require("./entities/cake.entity");
const cakes_service_1 = require("./cakes.service");
const cakes_controller_1 = require("./cakes.controller");
let CakesModule = class CakesModule {
};
exports.CakesModule = CakesModule;
exports.CakesModule = CakesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cake_entity_1.Cake])],
        controllers: [cakes_controller_1.CakesController],
        providers: [cakes_service_1.CakesService],
        exports: [cakes_service_1.CakesService],
    })
], CakesModule);
//# sourceMappingURL=cakes.module.js.map