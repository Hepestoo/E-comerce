import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'datos.env' });

@Injectable()
export class TelegramService {
  private botToken = process.env.TELEGRAM_BOT_TOKEN!;
  private chatId = process.env.TELEGRAM_CHAT_ID!;

  async enviarMensaje(mensaje: string): Promise<void> {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    await axios.post(url, {
      chat_id: this.chatId,
      text: mensaje,
      parse_mode: 'HTML',
    });
  }

  async enviarDocumento(rutaArchivo: string): Promise<void> {
    const url = `https://api.telegram.org/bot${this.botToken}/sendDocument`;
    const formData = new FormData();
    formData.append('chat_id', this.chatId);
    formData.append('document', fs.createReadStream(rutaArchivo));

    await axios.post(url, formData, {
      headers: formData.getHeaders(),
    });
  }
}
