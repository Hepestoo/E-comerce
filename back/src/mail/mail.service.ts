import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend'; // Importamos la librería nueva

@Injectable()
export class MailService {
  private resend: Resend; // Cliente de Resend
  private logger = new Logger('MailService');

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('RESEND_API_KEY');
    
    if (!apiKey) {
      this.logger.error('❌ FALTA LA API KEY DE RESEND EN VARIABLES DE ENTORNO');
    } else {
      this.resend = new Resend(apiKey);
      this.logger.log('✅ Resend configurado correctamente');
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const origins = this.configService.get<string>('CORS_ORIGINS');
    const frontendUrl = origins ? origins.split(',')[0] : 'http://localhost:4200';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    console.log(`🔗 Generando link para: ${frontendUrl}`);

    const htmlContent = `
      <div style="font-family:Arial,sans-serif;color:#222; padding: 20px; background-color: #f9f9f9; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7951a8; text-align: center;">Recuperación de contraseña</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <p>Hola,</p>
          <p>Has solicitado restablecer tu contraseña en <strong>Artemania</strong>.</p>
          <p>Haz clic en el siguiente botón para crear una nueva clave:</p>
          <br>
          <div style="text-align: center;">
            <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background: linear-gradient(135deg, #7951a8 0%, #a47bc4 100%);color:#fff;border-radius:25px;text-decoration:none;font-weight:bold;">Restablecer mi contraseña</a>
          </div>
        </div>
      </div>
    `;

    try {
      // Usamos la API de Resend (HTTP) -> ¡CERO BLOQUEOS!
      const data = await this.resend.emails.send({
        // Si no tienes dominio propio, Resend te obliga a usar este correo de prueba:
        from: 'onboarding@resend.dev', 
        to: [to], // El destinatario
        subject: 'Recuperación de contraseña - Artemania',
        html: htmlContent,
      });

      if (data.error) {
        this.logger.error('Error enviando email con Resend:', data.error);
        console.error(data.error);
      } else {
        this.logger.log(`✅ Correo enviado a ${to} (ID: ${data.data.id})`);
      }
      
    } catch (err) {
      this.logger.error('Error crítico enviando email', err);
      console.error(err);
    }
  }
}