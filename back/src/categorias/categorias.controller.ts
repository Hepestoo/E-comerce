import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/usuarios/decorators/roles.decorator';
import { RolesGuard } from 'src/usuarios/guards/roles.guard';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  // 🔓 PÚBLICO: Ver categorías
  @Get()
  async getAll() {
    return this.categoriasService.findAll();
  }

  // 🔒 ADMIN: Crear categoría
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.create(dto);
  }

  // 🔒 ADMIN: Editar categoría
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: CreateCategoriaDto) {
    return this.categoriasService.update(id, dto);
  }

  // 🔒 ADMIN: Eliminar categoría
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoriasService.remove(id);
  }
}