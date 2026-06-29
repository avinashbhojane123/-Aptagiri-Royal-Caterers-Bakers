import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cake } from '../cakes/entities/cake.entity';
import { User } from '../users/entities/user.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Cake)
    private cakesRepository: Repository<Cake>,
    private dataSource: DataSource,
    private whatsappService: WhatsappService,
  ) {}

  async create(user: User, createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalOrderPrice = 0;
      const orderItemsToSave: OrderItem[] = [];
      const cakesToUpdate: Cake[] = [];

      for (const itemDto of createOrderDto.orderItems) {
        // Lock the row for update to prevent concurrent race conditions in stock depletion
        const cake = await queryRunner.manager.findOne(Cake, {
          where: { id: itemDto.cakeId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!cake) {
          throw new NotFoundException(
            `Cake with ID ${itemDto.cakeId} not found`,
          );
        }

        if (cake.stock < itemDto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${cake.name}". Available: ${cake.stock}, Requested: ${itemDto.quantity}`,
          );
        }

        // Calculate prices
        const pricePerUnit = Number(cake.price);
        const itemTotal = pricePerUnit * itemDto.quantity;
        totalOrderPrice += itemTotal;

        // Deplete stock
        cake.stock -= itemDto.quantity;
        cakesToUpdate.push(cake);

        // Instantiate OrderItem
        const orderItem = new OrderItem();
        orderItem.cake = cake;
        orderItem.quantity = itemDto.quantity;
        orderItem.pricePerUnit = pricePerUnit;
        orderItemsToSave.push(orderItem);
      }

      // 1. Save all updated cakes
      for (const cake of cakesToUpdate) {
        await queryRunner.manager.save(cake);
      }

      // 2. Create the Order
      const order = new Order();
      order.user = user;
      order.totalPrice = totalOrderPrice;
      order.deliveryAddress = createOrderDto.deliveryAddress;
      order.status = OrderStatus.PENDING;
      order.orderItems = orderItemsToSave;

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      order.orderConfirmationOtp = otp;
      order.isConfirmed = false;

      // 3. Create initial Payment object
      const payment = new Payment();
      payment.status = PaymentStatus.PENDING;
      payment.paymentMethod = 'mock';
      order.payment = payment;

      // 4. Save order (cascades save to orderItems and payment)
      const savedOrder = await queryRunner.manager.save(order);

      this.logger.log(`[DEVELOPMENT BYPASS] Order Placement Confirmation OTP for Order ID ${savedOrder.id} is: ${otp}`);

      // Send WhatsApp Order Confirmation OTP
      const dbUser = await queryRunner.manager.findOne(User, {
        where: { id: user.id },
      });

      if (dbUser && dbUser.phoneNumber) {
        const otpMessage = `🍰 *APTAGIRI ROYAL Caterers & Events Order Confirmation OTP*\n\nThank you for your order! Your confirmation OTP is: *${otp}*.\n\nPlease enter this code on the website to confirm your order placement.`;
        await this.whatsappService.sendMessage(dbUser.phoneNumber, otpMessage);
      } else {
        this.logger.warn(
          `No phone number associated with user ID ${user.id}. WhatsApp OTP skipped.`,
        );
      }

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: { user: true, orderItems: { cake: true }, payment: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: { orderItems: { cake: true }, payment: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: { user: true, orderItems: { cake: true }, payment: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async confirmOrder(id: string, otp: string, userId: string): Promise<Order> {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.user.id !== userId) {
      throw new BadRequestException('You are not authorized to confirm this order.');
    }

    if (order.isConfirmed) {
      return order;
    }

    if (order.orderConfirmationOtp !== otp) {
      throw new BadRequestException('Invalid order confirmation OTP.');
    }

    order.isConfirmed = true;
    order.orderConfirmationOtp = null;
    return this.ordersRepository.save(order);
  }

  async updateStatus(id: string, status: OrderStatus, otp?: string): Promise<any> {
    const order = await this.findOne(id);

    // If order is transitioning to CANCELLED, restore the stock of products
    if (
      status === OrderStatus.CANCELLED &&
      order.status !== OrderStatus.CANCELLED
    ) {
      for (const item of order.orderItems) {
        if (item.cake) {
          item.cake.stock += item.quantity;
          await this.cakesRepository.save(item.cake);
        }
      }
    }

    if (status === OrderStatus.DELIVERED) {
      if (otp) {
        if (order.deliveryConfirmationOtp !== otp) {
          throw new BadRequestException('Invalid delivery confirmation OTP.');
        }
        order.deliveryConfirmationOtp = null;
      } else {
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
}
