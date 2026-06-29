import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class WhatsappService implements OnModuleInit {
    private configService;
    private readonly logger;
    private readonly apiUrl;
    private readonly sessionName;
    private readonly apiKey;
    private resolvedSessionId;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    getStatus(): Promise<any>;
    restartSession(): Promise<any>;
    private resolveSession;
    private formatPhoneNumber;
    sendMessage(to: string, message: string): Promise<boolean>;
}
