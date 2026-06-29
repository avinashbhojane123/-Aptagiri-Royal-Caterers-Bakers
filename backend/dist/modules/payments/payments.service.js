"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const Razorpay = require('razorpay');
let PaymentsService = class PaymentsService {
    paymentsRepository;
    ordersRepository;
    whatsappService;
    configService;
    constructor(paymentsRepository, ordersRepository, whatsappService, configService) {
        this.paymentsRepository = paymentsRepository;
        this.ordersRepository = ordersRepository;
        this.whatsappService = whatsappService;
        this.configService = configService;
    }
    getRazorpayInstance() {
        const keyId = this.configService.get('RAZORPAY_KEY_ID');
        const keySecret = this.configService.get('RAZORPAY_KEY_SECRET');
        if (!keyId || !keySecret) {
            throw new common_1.BadRequestException('Razorpay credentials are not configured on the backend server. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the environment.');
        }
        return {
            razorpay: new Razorpay({ key_id: keyId, key_secret: keySecret }),
            keyId,
            keySecret,
        };
    }
    async createRazorpayOrder(requestingUser, orderId) {
        const order = await this.ordersRepository.findOne({
            where: { id: orderId },
            relations: { payment: true, user: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
        }
        if (requestingUser.role !== 'admin' &&
            order.user &&
            order.user.id !== requestingUser.id) {
            throw new common_1.ForbiddenException('You do not have permission to initiate payment for this order');
        }
        if (!order.isConfirmed) {
            throw new common_1.BadRequestException('Order must be confirmed via OTP before payment can be initiated.');
        }
        if (order.status !== order_entity_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('Order has already been processed.');
        }
        const { razorpay, keyId } = this.getRazorpayInstance();
        try {
            const rzpOrder = await razorpay.orders.create({
                amount: Math.round(Number(order.totalPrice) * 100),
                currency: 'INR',
                receipt: `receipt_order_${order.id}`,
            });
            if (order.payment) {
                order.payment.razorpayOrderId = rzpOrder.id;
                await this.paymentsRepository.save(order.payment);
            }
            return {
                id: rzpOrder.id,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                keyId,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(`Failed to create Razorpay Order: ${err.message}`);
        }
    }
    async processPayment(requestingUser, processPaymentDto) {
        const order = await this.ordersRepository.findOne({
            where: { id: processPaymentDto.orderId },
            relations: { payment: true, user: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${processPaymentDto.orderId} not found`);
        }
        if (requestingUser.role !== 'admin' &&
            order.user &&
            order.user.id !== requestingUser.id) {
            throw new common_1.ForbiddenException('You do not have permission to process payment for this order');
        }
        if (!order.isConfirmed) {
            throw new common_1.BadRequestException('Order must be confirmed via OTP before payment can be processed.');
        }
        if (!order.payment) {
            throw new common_1.NotFoundException(`Payment record not found for Order ID ${processPaymentDto.orderId}`);
        }
        if (order.payment.status === payment_entity_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Order has already been paid');
        }
        const { keySecret } = this.getRazorpayInstance();
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = processPaymentDto;
        const text = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(text)
            .digest('hex');
        if (expectedSignature !== razorpaySignature) {
            throw new common_1.BadRequestException('Payment verification failed. Signature mismatch.');
        }
        const payment = order.payment;
        payment.paymentMethod = 'razorpay';
        payment.transactionId = razorpayPaymentId;
        payment.razorpayOrderId = razorpayOrderId;
        payment.razorpayPaymentId = razorpayPaymentId;
        payment.razorpaySignature = razorpaySignature;
        payment.status = payment_entity_1.PaymentStatus.COMPLETED;
        const savedPayment = await this.paymentsRepository.save(payment);
        order.status = order_entity_1.OrderStatus.PROCESSING;
        const savedOrder = await this.ordersRepository.save(order);
        if (savedOrder.user && savedOrder.user.phoneNumber) {
            const message = `🍰 *APTAGIRI ROYAL Caterers & Events - Order Confirmed!*\n\nThank you, ${savedOrder.user.name}! Your order has been placed successfully.\n\n*Order ID:* ${savedOrder.id}\n*Total price:* ₹${Number(savedOrder.totalPrice).toFixed(2)}\n*Status:* ${savedOrder.status.toUpperCase()}\n\nWe are now preparing your delicious treats!`;
            await this.whatsappService.sendMessage(savedOrder.user.phoneNumber, message);
        }
        return savedPayment;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        whatsapp_service_1.WhatsappService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map