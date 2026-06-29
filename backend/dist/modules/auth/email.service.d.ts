import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendMail(to: string, subject: string, text: string, html?: string): Promise<boolean>;
}
