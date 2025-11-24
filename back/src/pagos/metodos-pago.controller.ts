import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MetodosPagoService } from './metodos-pago.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/usuarios/decorators/roles.decorator';
import { RolesGuard } from 'src/usuarios/guards/roles.guard';

@Controller('metodos-pago')
export class MetodosPagoController {
  constructor(private readonly service: MetodosPagoService) {}

  // 🔓 PÚBLICO: El cliente necesita verlos para pagar
  @Get()
  getAll() {
    return this.service.findAll();
  }

  // 🔒 ADMIN: Solo tú puedes crear/editar formas de pago
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.service.update(id, body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.remove(id);
  }
}