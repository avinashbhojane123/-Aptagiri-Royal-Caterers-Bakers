import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly apiUrl: string;
  private readonly sessionName: string;
  private readonly apiKey: string;
  private resolvedSessionId: string | null = null;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('OPENWA_API_URL') || 'http://localhost:2785/api';
    this.sessionName = this.configService.get<string>('OPENWA_SESSION_ID') || 'sweetslice-session';
    this.apiKey = this.configService.get<string>('OPENWA_API_KEY') || '';
  }

  async onModuleInit() {
    try {
      await this.resolveSession();
    } catch (err: any) {
      this.logger.error(`Could not initialize WhatsApp session on startup: ${err.message}`);
    }
  }

  async getStatus(): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    try {
      const listRes = await fetch(`${this.apiUrl}/sessions`, { headers });
      if (!listRes.ok) {
        throw new Error(`Failed to list sessions: ${await listRes.text()}`);
      }
      const sessions = (await listRes.json()) as any[];
      const session = sessions.find((s) => s.name === this.sessionName);

      if (!session) {
        return {
          status: 'disconnected',
          name: this.sessionName,
          qrCode: null,
        };
      }

      this.resolvedSessionId = session.id;

      let qrCode = null;
      if (session.status === 'qr_ready') {
        try {
          const qrRes = await fetch(`${this.apiUrl}/sessions/${session.id}/qr`, { headers });
          if (qrRes.ok) {
            const qrData = (await qrRes.json()) as any;
            qrCode = qrData.qrCode;
          }
        } catch (err: any) {
          this.logger.warn(`Failed to fetch QR code: ${err.message}`);
        }
      }

      return {
        id: session.id,
        name: session.name,
        status: session.status,
        phone: session.phone,
        pushName: session.pushName,
        connectedAt: session.connectedAt,
        lastActive: session.lastActive,
        qrCode,
      };
    } catch (error: any) {
      this.logger.error(`Error fetching WhatsApp status: ${error.message}`);
      throw error;
    }
  }

  async restartSession(): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    const sessionId = await this.resolveSession();

    this.logger.log(`Restarting WhatsApp session "${this.sessionName}" (UUID: "${sessionId}")...`);

    try {
      await fetch(`${this.apiUrl}/sessions/${sessionId}/stop`, {
        method: 'POST',
        headers,
      });
    } catch (err: any) {
      this.logger.warn(`Failed to stop session during restart: ${err.message}`);
    }

    const startRes = await fetch(`${this.apiUrl}/sessions/${sessionId}/start`, {
      method: 'POST',
      headers,
    });

    if (!startRes.ok) {
      throw new Error(`Failed to start session during restart: ${await startRes.text()}`);
    }

    const session = await startRes.json();
    return session;
  }

  private async resolveSession(): Promise<string> {
    if (this.resolvedSessionId) {
      return this.resolvedSessionId;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    // 1. Get sessions
    const listRes = await fetch(`${this.apiUrl}/sessions`, { headers });
    if (!listRes.ok) {
      throw new Error(`Failed to list sessions: ${await listRes.text()}`);
    }
    const sessions = (await listRes.json()) as any[];
    let session = sessions.find((s) => s.name === this.sessionName);

    if (!session) {
      this.logger.log(`Session "${this.sessionName}" not found in OpenWA. Creating it...`);
      const createRes = await fetch(`${this.apiUrl}/sessions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: this.sessionName }),
      });

      if (!createRes.ok) {
        throw new Error(`Failed to create session: ${await createRes.text()}`);
      }
      session = await createRes.json();
      this.logger.log(`Session "${this.sessionName}" created successfully with UUID "${session.id}".`);
    } else {
      this.logger.log(`Found existing session "${this.sessionName}" with UUID "${session.id}".`);
    }

    this.resolvedSessionId = session.id;

    // 2. Start session if not in active state
    const activeStatuses = ['initializing', 'qr_ready', 'authenticating', 'ready'];
    if (!activeStatuses.includes(session.status)) {
      this.logger.log(`Starting session "${this.sessionName}" (UUID: "${session.id}")...`);
      const startRes = await fetch(`${this.apiUrl}/sessions/${session.id}/start`, {
        method: 'POST',
        headers,
      });

      if (!startRes.ok) {
        throw new Error(`Failed to start session: ${await startRes.text()}`);
      }
      const startedSession = await startRes.json();
      this.logger.log(`Session "${this.sessionName}" started successfully. Status: ${startedSession.status}`);
    }

    return this.resolvedSessionId!;
  }

  private formatPhoneNumber(phone: string): string {
    if (phone.endsWith('@c.us') || phone.endsWith('@g.us')) {
      return phone;
    }
    const digits = phone.replace(/\D/g, '');
    return `${digits}@c.us`;
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    if (!to) {
      this.logger.warn('No recipient phone number provided. Skipping WhatsApp notification.');
      return false;
    }

    try {
      const sessionId = await this.resolveSession();
      const chatId = this.formatPhoneNumber(to);
      const url = `${this.apiUrl}/sessions/${sessionId}/messages/send-text`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (this.apiKey) {
        headers['X-API-Key'] = this.apiKey;
      }

      this.logger.log(`Attempting to send WhatsApp message to ${chatId} via OpenWA...`);
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          chatId,
          text: message,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`OpenWA API returned error: Status ${response.status} - ${errorText}`);
        return false;
      }

      this.logger.log(`WhatsApp message sent successfully to ${chatId}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to send WhatsApp message: ${error.message}`);
      return false;
    }
  }
}
