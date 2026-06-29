import { PaymentsService } from './payments.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(req: any, body: {
        orderId: string;
    }): Promise<any>;
    processPayment(req: any, processPaymentDto: ProcessPaymentDto): Promise<import("./entities/payment.entity").Payment>;
}
