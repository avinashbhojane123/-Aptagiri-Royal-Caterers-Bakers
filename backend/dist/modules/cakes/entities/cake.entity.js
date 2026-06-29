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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cake = exports.CakeSize = void 0;
const typeorm_1 = require("typeorm");
const order_item_entity_1 = require("../../orders/entities/order-item.entity");
var CakeSize;
(function (CakeSize) {
    CakeSize["SMALL"] = "small";
    CakeSize["MEDIUM"] = "medium";
    CakeSize["LARGE"] = "large";
})(CakeSize || (exports.CakeSize = CakeSize = {}));
let Cake = class Cake {
    id;
    name;
    description;
    price;
    stock;
    imageUrl;
    flavor;
    size;
    orderItems;
    createdAt;
};
exports.Cake = Cake;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cake.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cake.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Cake.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Cake.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cake.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cake.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cake.prototype, "flavor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CakeSize,
        default: CakeSize.MEDIUM,
    }),
    __metadata("design:type", String)
], Cake.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItem, (orderItem) => orderItem.cake),
    __metadata("design:type", Array)
], Cake.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Cake.prototype, "createdAt", void 0);
exports.Cake = Cake = __decorate([
    (0, typeorm_1.Entity)('cakes')
], Cake);
//# sourceMappingURL=cake.entity.js.map