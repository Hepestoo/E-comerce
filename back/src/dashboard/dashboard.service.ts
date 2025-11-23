import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orden } from '../ordenes/entities/orden.entity';
import { Producto } from '../productos/entities/producto.entity';
import { User } from '../usuarios/entities/user.entity';
import { Pago } from '../pagos/entities/pago.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Orden) private ordenRepo: Repository<Orden>,
    @InjectRepository(Producto) private productoRepo: Repository<Producto>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Pago) private pagoRepo: Repository<Pago>,
  ) {}

  async getStats() {
    const [totalOrdenes, totalProductos, totalClientes, pagos] = await Promise.all([
      this.ordenRepo.count(),
      this.productoRepo.count(),
      this.userRepo.count({ where: { rol: 'cliente' } }),
      this.pagoRepo.find()
    ]);

    const totalVentas = pagos.reduce((acc, pago) => acc + Number(pago.monto), 0);

    return {
      ventas: totalVentas,
      ordenes: totalOrdenes,
      productos: totalProductos,
      clientes: totalClientes
    };
  }

  async getLatestOrders() {
    const ordenes = await this.ordenRepo.find({
      relations: ['usuario'],
      // ✅ CORRECCIÓN 1: Usamos 'fecha_creacion' que es como se llama en tu entity
      order: { fecha_creacion: 'DESC' }, 
      take: 5
    });

    return ordenes.map(orden => {
      // ✅ CORRECCIÓN 2: Lógica para el nombre del cliente
      // Si hay usuario registrado, unimos nombre y apellido.
      // Si no, intentamos usar 'nombre_cliente' de la orden, o ponemos 'Anónimo'.
      let nombreCliente = 'Cliente Anónimo';
      
      if (orden.usuario) {
        nombreCliente = `${orden.usuario.nombre} ${orden.usuario.apellido}`;
      } else if (orden.nombre_cliente) {
        nombreCliente = orden.nombre_cliente;
      }

      return {
        id: orden.id,
        cliente: nombreCliente,
        // ✅ CORRECCIÓN 3: Usamos 'fecha_creacion'
        fechaTexto: orden.fecha_creacion ? new Date(orden.fecha_creacion).toLocaleDateString() : 'Fecha desc.',
        total: Number(orden.total),
        estado: orden.estado
      };
    });
  }

  async getRecentActivity() {
    const ultimasOrdenes = await this.ordenRepo.find({
      relations: ['usuario'],
      // ✅ CORRECCIÓN 4: Usamos 'fecha_creacion'
      order: { fecha_creacion: 'DESC' }, 
      take: 4
    });

    return ultimasOrdenes.map(orden => {
       // Misma lógica para el nombre
       const nombre = orden.usuario ? orden.usuario.nombre : (orden.nombre_cliente || 'un cliente');

       return {
        titulo: `Nueva orden de ${nombre}`,
        hace: 'Hace un momento', 
        dotClass: 'blue'
      };
    });
  }
}