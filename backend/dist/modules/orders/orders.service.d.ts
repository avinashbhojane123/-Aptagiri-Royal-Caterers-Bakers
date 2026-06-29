import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cake } from '../cakes/entities/cake.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private cakesRepository;
    private dataSource;
    private whatsappService;
    private readonly logger;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, cakesRepository: Repository<Cake>, dataSource: DataSource, whatsappService: WhatsappService);
    create(user: User, createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(): Promise<Order[]>;
    findByUser(userId: string): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    confirmOrder(id: string, otp: string, userId: string): Promise<Order>;
    updateStatus(id: string, status: OrderStatus, otp?: string): Promise<any>;
}
