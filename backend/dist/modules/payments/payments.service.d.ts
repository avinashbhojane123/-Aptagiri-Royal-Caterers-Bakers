import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ConfigService } from '@nestjs/config';
export declare class PaymentsService {
    private paymentsRepository;
    private ordersRepository;
    private whatsappService;
    private configService;
    constructor(paymentsRepository: Repository<Payment>, ordersRepository: Repository<Order>, whatsappService: WhatsappService, configService: ConfigService);
    private getRazorpayInstance;
    createRazorpayOrder(requestingUser: any, orderId: string): Promise<any>;
    processPayment(requestingUser: any, processPaymentDto: ProcessPaymentDto): Promise<Payment>;
}
