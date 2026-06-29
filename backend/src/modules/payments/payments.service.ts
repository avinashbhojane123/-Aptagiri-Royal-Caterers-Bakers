import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
const Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private whatsappService: WhatsappService,
    private configService: ConfigService,
  ) {}

  private getRazorpayInstance() {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (!keyId || !keySecret) {
      throw new BadRequestException(
        'Razorpay credentials are not configured on the backend server. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the environment.',
      );
    }
    return {
      razorpay: new Razorpay({ key_id: keyId, key_secret: keySecret }),
      keyId,
      keySecret,
    };
  }

  async createRazorpayOrder(
    requestingUser: any,
    orderId: string,
  ): Promise<any> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: { payment: true, user: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (
      requestingUser.role !== 'admin' &&
      order.user &&
      order.user.id !== requestingUser.id
    ) {
      throw new ForbiddenException(
        'You do not have permission to initiate payment for this order',
      );
    }

    if (!order.isConfirmed) {
      throw new BadRequestException(
        'Order must be confirmed via OTP before payment can be initiated.',
      );
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order has already been processed.');
    }

    const { razorpay, keyId } = this.getRazorpayInstance();

    try {
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(Number(order.totalPrice) * 100), // in paisa
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
    } catch (err: any) {
      throw new BadRequestException(
        `Failed to create Razorpay Order: ${err.message}`,
      );
    }
  }

  async processPayment(
    requestingUser: any,
    processPaymentDto: ProcessPaymentDto,
  ): Promise<Payment> {
    const order = await this.ordersRepository.findOne({
      where: { id: processPaymentDto.orderId },
      relations: { payment: true, user: true },
    });

    if (!order) {
      throw new NotFoundException(
        `Order with ID ${processPaymentDto.orderId} not found`,
      );
    }

    if (
      requestingUser.role !== 'admin' &&
      order.user &&
      order.user.id !== requestingUser.id
    ) {
      throw new ForbiddenException(
        'You do not have permission to process payment for this order',
      );
    }

    if (!order.isConfirmed) {
      throw new BadRequestException(
        'Order must be confirmed via OTP before payment can be processed.',
      );
    }

    if (!order.payment) {
      throw new NotFoundException(
        `Payment record not found for Order ID ${processPaymentDto.orderId}`,
      );
    }

    if (order.payment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Order has already been paid');
    }

    const { keySecret } = this.getRazorpayInstance();

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      processPaymentDto;
    const text = razorpayOrderId + '|' + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      throw new BadRequestException(
        'Payment verification failed. Signature mismatch.',
      );
    }

    const payment = order.payment;

    payment.paymentMethod = 'razorpay';
    payment.transactionId = razorpayPaymentId;
    payment.razorpayOrderId = razorpayOrderId;
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = PaymentStatus.COMPLETED;

    const savedPayment = await this.paymentsRepository.save(payment);

    order.status = OrderStatus.PROCESSING;
    const savedOrder = await this.ordersRepository.save(order);

    if (savedOrder.user && savedOrder.user.phoneNumber) {
      const message = `🍰 *APTAGIRI ROYAL Caterers & Events - Order Confirmed!*\n\nThank you, ${savedOrder.user.name}! Your order has been placed successfully.\n\n*Order ID:* ${savedOrder.id}\n*Total price:* ₹${Number(savedOrder.totalPrice).toFixed(2)}\n*Status:* ${savedOrder.status.toUpperCase()}\n\nWe are now preparing your delicious treats!`;
      await this.whatsappService.sendMessage(
        savedOrder.user.phoneNumber,
        message,
      );
    }

    return savedPayment;
  }
}
