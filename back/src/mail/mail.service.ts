import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;
  private logger = new Logger('MailService');

  constructor(private configService: ConfigService) {
    const usuario = this.configService.get('EMAIL_USER');
    const pass = this.configService.get('EMAIL_PASS');
    
    // Logs para depuración (opcional, puedes borrarlos si quieres limpiar la consola)
    console.log('📧 Configurando correo con usuario:', usuario ? 'OK' : 'FALTA');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: usuario,
        pass: pass,
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    // --- LÓGICA INTELIGENTE PARA LA URL ---
    // 1. Obtenemos la variable CORS_ORIGINS (ej: "https://mi-web.com,http://localhost:4200")
    const origins = this.configService.get<string>('CORS_ORIGINS');
    
    // 2. Tomamos la primera URL de la lista. 
    // Si no existe (por error), usamos localhost como respaldo.
    const frontendUrl = origins ? origins.split(',')[0] : 'http://localhost:4200';
    
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    console.log(`🔗 Generando link para: ${frontendUrl}`); // Para que veas en logs cuál usó

    const html = `
      <div style="font-family:Arial,sans-serif;color:#222; padding: 20px; background-color: #f9f9f9; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7951a8; text-align: center;">Recuperación de contraseña</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <p>Hola,</p>
          <p>Has solicitado restablecer tu contraseña en <strong>Artemania</strong>.</p>
          <p>Haz clic en el siguiente botón para crear una nueva clave (el enlace expira en 1 hora):</p>
          <br>
          <div style="text-align: center;">
            <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background: linear-gradient(135deg, #7951a8 0%, #a47bc4 100%);color:#fff;border-radius:25px;text-decoration:none;font-weight:bold;box-shadow: 0 4px 10px rgba(121, 81, 155, 0.3);">Restablecer mi contraseña</a>
          </div>
          <br>
          <p style="font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">
            Si no solicitaste este cambio, por favor ignora este correo. Tu cuenta sigue segura.
          </p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: '"Soporte Artemania" <no-reply@artemania.com>',
        to,
        subject: 'Recuperación de contraseña - Artemania',
        html,
      });
      this.logger.log(`Correo enviado a ${to}`);
    } catch (err) {
      this.logger.error('Error enviando email', err);
    }
  }
}