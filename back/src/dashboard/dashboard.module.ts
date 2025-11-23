import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Orden } from '../ordenes/entities/orden.entity'; // Verifica la ruta
import { Producto } from '../productos/entities/producto.entity'; // Verifica la ruta
import { User } from '../usuarios/entities/user.entity'; // Verifica la ruta
import { Pago } from '../pagos/entities/pago.entity'; // Verifica la ruta

@Module({
  imports: [
    TypeOrmModule.forFeature([Orden, Producto, User, Pago])
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}