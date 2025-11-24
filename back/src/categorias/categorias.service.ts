import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private categoriasRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return this.categoriasRepository.find();
  }

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    const nueva = this.categoriasRepository.create(dto);
    return this.categoriasRepository.save(nueva);
  }

  async update(id: number, dto: Partial<CreateCategoriaDto>): Promise<Categoria> {
    const categoria = await this.categoriasRepository.preload({
      id: id,
      ...dto,
    });
    if (!categoria) throw new NotFoundException(`Categoría #${id} no encontrada`);
    return this.categoriasRepository.save(categoria);
  }

  async remove(id: number): Promise<void> {
    const resultado = await this.categoriasRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Categoría #${id} no encontrada`);
    }
  }
}