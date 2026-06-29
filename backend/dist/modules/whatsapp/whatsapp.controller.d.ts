import { WhatsappService } from './whatsapp.service';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    getStatus(): Promise<any>;
    sendTestMessage(body: {
        to: string;
        message: string;
    }): Promise<{
        success: boolean;
    }>;
    restartSession(): Promise<{
        success: boolean;
        session: any;
    }>;
}
