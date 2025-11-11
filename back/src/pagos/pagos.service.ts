import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { MetodoPago } from './entities/metodo-pago.entity';
import { sendTelegramMessage } from 'src/telegram/telegram.helper';
import { Orden } from 'src/ordenes/entities/orden.entity';
import { TelegramService } from '../telegram/telegram.service';
import { PdfService } from '../pdf/pdf.service'; 


@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private pagoRepo: Repository<Pago>,

    @InjectRepository(MetodoPago)
    private metodoRepo: Repository<MetodoPago>,

    @InjectRepository(Orden)
    private ordenRepo: Repository<Orden>,
    private telegramService: TelegramService,
    private pdfService: PdfService

  ) { }


  async crearPago(dto: CreatePagoDto) {
    const metodo = await this.metodoRepo.findOne({ where: { id: dto.metodo_pago_id } });
    if (!metodo) throw new NotFoundException('Método de pago no válido');
  
    const pago = this.pagoRepo.create({
      ...dto,
      estado: dto.estado || 'completado',
    });
    await this.pagoRepo.save(pago);
  
    // Buscar la orden completa
    const orden = await this.ordenRepo.findOne({
      where: { id: dto.orden_id },
      relations: ['detalles', 'detalles.producto', 'pagos', 'pagos.metodo'],
    });
  
    if (orden) {
      const datosCliente = {
        nombre: orden.nombre_cliente || 'No disponible',
        telefono: orden.telefono || 'No disponible',
        direccion: orden.direccion || 'No disponible',
      };
  
      const nombreArchivo = `orden-${orden.id}-${datosCliente.nombre.replace(/\s/g, '_')}.pdf`;
  
      // ✅ Generar PDF de la factura
      const rutaPDF = await this.pdfService.generarFactura(orden, datosCliente, nombreArchivo);
  
      // ✅ Enviar el PDF a Telegram
      await this.telegramService.enviarDocumento(rutaPDF);
    }
  
    return pago;
  }
  

  async listarPagosPorOrden(orden_id: number) {
    return this.pagoRepo.find({
      where: { orden_id },
      relations: ['metodo'],
    });
  }

  async listarMetodosDePago() {
    return this.metodoRepo.find();
  }

  async crearMetodo(nombre: string, descripcion?: string) {
    const metodo = this.metodoRepo.create({ nombre, descripcion });
    return this.metodoRepo.save(metodo);
  }
}
