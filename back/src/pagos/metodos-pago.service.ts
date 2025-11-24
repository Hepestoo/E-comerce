import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPago } from './entities/metodo-pago.entity';

@Injectable()
export class MetodosPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private repo: Repository<MetodoPago>,
  ) {}

  async findAll() {
    return this.repo.find();
  }

  async create(datos: Partial<MetodoPago>) {
    const nuevo = this.repo.create(datos);
    return this.repo.save(nuevo);
  }

  async update(id: number, datos: Partial<MetodoPago>) {
    const metodo = await this.repo.preload({ id, ...datos });
    if (!metodo) throw new NotFoundException(`Método #${id} no encontrado`);
    return this.repo.save(metodo);
  }

  async remove(id: number) {
    const resultado = await this.repo.delete(id);
    if (resultado.affected === 0) throw new NotFoundException(`Método #${id} no encontrado`);
    return { message: 'Eliminado correctamente' };
  }
}