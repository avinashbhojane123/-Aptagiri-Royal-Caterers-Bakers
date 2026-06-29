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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const cake_entity_1 = require("../cakes/entities/cake.entity");
const user_entity_1 = require("../users/entities/user.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let OrdersService = OrdersService_1 = class OrdersService {
    ordersRepository;
    orderItemsRepository;
    cakesRepository;
    dataSource;
    whatsappService;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(ordersRepository, orderItemsRepository, cakesRepository, dataSource, whatsappService) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.cakesRepository = cakesRepository;
        this.dataSource = dataSource;
        this.whatsappService = whatsappService;
    }
    async create(user, createOrderDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let totalOrderPrice = 0;
            const orderItemsToSave = [];
            const cakesToUpdate = [];
            for (const itemDto of createOrderDto.orderItems) {
                const cake = await queryRunner.manager.findOne(cake_entity_1.Cake, {
                    where: { id: itemDto.cakeId },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!cake) {
                    throw new common_1.NotFoundException(`Cake with ID ${itemDto.cakeId} not found`);
                }
                if (cake.stock < itemDto.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for "${cake.name}". Available: ${cake.stock}, Requested: ${itemDto.quantity}`);
                }
                const pricePerUnit = Number(cake.price);
                const itemTotal = pricePerUnit * itemDto.quantity;
                totalOrderPrice += itemTotal;
                cake.stock -= itemDto.quantity;
                cakesToUpdate.push(cake);
                const orderItem = new order_item_entity_1.OrderItem();
                orderItem.cake = cake;
                orderItem.quantity = itemDto.quantity;
                orderItem.pricePerUnit = pricePerUnit;
                orderItemsToSave.push(orderItem);
            }
            for (const cake of cakesToUpdate) {
                await queryRunner.manager.save(cake);
            }
            const order = new order_entity_1.Order();
            order.user = user;
            order.totalPrice = totalOrderPrice;
            order.deliveryAddress = createOrderDto.deliveryAddress;
            order.status = order_entity_1.OrderStatus.PENDING;
            order.orderItems = orderItemsToSave;
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            order.orderConfirmationOtp = otp;
            order.isConfirmed = false;
            const payment = new payment_entity_1.Payment();
            payment.status = payment_entity_1.PaymentStatus.PENDING;
            payment.paymentMethod = 'mock';
            order.payment = payment;
            const savedOrder = await queryRunner.manager.save(order);
            this.logger.log(`[DEVELOPMENT BYPASS] Order Placement Confirmation OTP for Order ID ${savedOrder.id} is: ${otp}`);
            const dbUser = await queryRunner.manager.findOne(user_entity_1.User, {
                where: { id: user.id },
            });
            if (dbUser && dbUser.phoneNumber) {
                const otpMessage = `🍰 *APTAGIRI ROYAL Caterers & Events Order Confirmation OTP*\n\nThank you for your order! Your confirmation OTP is: *${otp}*.\n\nPlease enter this code on the website to confirm your order placement.`;
                await this.whatsappService.sendMessage(dbUser.phoneNumber, otpMessage);
            }
            else {
                this.logger.warn(`No phone number associated with user ID ${user.id}. WhatsApp OTP skipped.`);
            }
            await queryRunner.commitTransaction();
            return savedOrder;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        return this.ordersRepository.find({
            relations: { user: true, orderItems: { cake: true }, payment: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findByUser(userId) {
        return this.ordersRepository.find({
            where: { user: { id: userId } },
            relations: { orderItems: { cake: true }, payment: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: { user: true, orderItems: { cake: true }, payment: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async confirmOrder(id, otp, userId) {
        const order = await this.findOne(id);
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        if (order.user.id !== userId) {
            throw new common_1.BadRequestException('You are not authorized to confirm this order.');
        }
        if (order.isConfirmed) {
            return order;
        }
        if (order.orderConfirmationOtp !== otp) {
            throw new common_1.BadRequestException('Invalid order confirmation OTP.');
        }
        order.isConfirmed = true;
        order.orderConfirmationOtp = null;
        return this.ordersRepository.save(order);
    }
    async updateStatus(id, status, otp) {
        const order = await this.findOne(id);
        if (status === order_entity_1.OrderStatus.CANCELLED &&
            order.status !== order_entity_1.OrderStatus.CANCELLED) {
            for (const item of order.orderItems) {
                if (item.cake) {
                    item.cake.stock += item.quantity;
                    await this.cakesRepository.save(item.cake);
                }
            }
        }
        if (status === order_entity_1.OrderStatus.DELIVERED) {
            if (otp) {
                if (order.deliveryConfirmationOtp !== otp) {
                    throw new common_1.BadRequestException('Invalid delivery confirmation OTP.');
                }
                order.deliveryConfirmationOtp = null;
            }
            else {
                let deliveryOtp = order.deliveryConfirmationOtp;
                if (!deliveryOtp) {
                    deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    order.deliveryConfirmationOtp = deliveryOtp;
                    await this.ordersRepository.save(order);
                }
                this.logger.log(`[DEVELOPMENT BYPASS] Delivery Confirmation OTP for Order ID ${order.id} is: ${deliveryOtp}`);
                if (order.user && order.user.phoneNumber) {
                    const message = `🚚 *APTAGIRI ROYAL Caterers & Events Delivery Confirmation OTP*\n\nYour order is out for delivery! Please provide this OTP code to the delivery agent to confirm receipt: *${deliveryOtp}*`;
                    await this.whatsappService.sendMessage(order.user.phoneNumber, message);
                }
                return {
                    otpRequired: true,
                    message: 'Delivery OTP has been sent to the customer via WhatsApp.',
                };
            }
        }
        order.status = status;
        const savedOrder = await this.ordersRepository.save(order);
        if (savedOrder.user && savedOrder.user.phoneNumber) {
            const message = `🍰 *APTAGIRI ROYAL Caterers & Events Update*\n\nYour order (ID: ${savedOrder.id}) status has been updated to *${status.toUpperCase()}*.\n\nThank you for choosing APTAGIRI ROYAL Caterers & Events!`;
            await this.whatsappService.sendMessage(savedOrder.user.phoneNumber, message);
        }
        return savedOrder;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(cake_entity_1.Cake)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        whatsapp_service_1.WhatsappService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map