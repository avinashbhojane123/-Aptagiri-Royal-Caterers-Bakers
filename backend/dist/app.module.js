"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./modules/users/entities/user.entity");
const cake_entity_1 = require("./modules/cakes/entities/cake.entity");
const order_entity_1 = require("./modules/orders/entities/order.entity");
const order_item_entity_1 = require("./modules/orders/entities/order-item.entity");
const payment_entity_1 = require("./modules/payments/entities/payment.entity");
const caterer_menu_entity_1 = require("./modules/caterers/entities/caterer-menu.entity");
const users_module_1 = require("./modules/users/users.module");
const cakes_module_1 = require("./modules/cakes/cakes.module");
const auth_module_1 = require("./modules/auth/auth.module");
const orders_module_1 = require("./modules/orders/orders.module");
const payments_module_1 = require("./modules/payments/payments.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const caterers_module_1 = require("./modules/caterers/caterers.module");
const whatsapp_module_1 = require("./modules/whatsapp/whatsapp.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'postgres',
                    host: process.env.DB_HOST || 'localhost',
                    port: parseInt(process.env.DB_PORT || '5432', 10),
                    username: process.env.DB_USERNAME || 'postgres',
                    password: process.env.DB_PASSWORD || 'postgres',
                    database: process.env.DB_DATABASE || 'cake_shop',
                    entities: [user_entity_1.User, cake_entity_1.Cake, order_entity_1.Order, order_item_entity_1.OrderItem, payment_entity_1.Payment, caterer_menu_entity_1.CatererMenu],
                    synchronize: true,
                }),
            }),
            users_module_1.UsersModule,
            cakes_module_1.CakesModule,
            auth_module_1.AuthModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            analytics_module_1.AnalyticsModule,
            caterers_module_1.CaterersModule,
            whatsapp_module_1.WhatsappModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map