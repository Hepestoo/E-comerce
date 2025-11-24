import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 👇 Importaciones para corregir el error de RolesGuard/JWT
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Controladores
import { PagosController } from './pagos.controller';
import { MetodosPagoController } from './metodos-pago.controller';

// Servicios
import { PagosService } from './pagos.service';
import { MetodosPagoService } from './metodos-pago.service';

// Entidades
import { Pago } from './entities/pago.entity';
import { MetodoPago } from './entities/metodo-pago.entity';
import { Orden } from '../ordenes/entities/orden.entity';

// Módulos Externos
import { PdfModule } from '../pdf/pdf.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    // 1. Base de Datos
    TypeOrmModule.forFeature([Pago, MetodoPago, Orden]),
    
    // 2. Módulos Externos (PDF y Telegram)
    PdfModule,
    TelegramModule,

    // 3. 👇 SOLUCIÓN DEL ERROR: Configuración de JWT para los Guards
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [
    PagosController, 
    MetodosPagoController
  ],
  providers: [
    PagosService, 
    MetodosPagoService
  ],
  exports: [
    PagosService, 
    MetodosPagoService
  ]
})
export class PagosModule {}