import { Controller, Post, Body, Get, Query, Patch, Param, UseGuards, Req, UnauthorizedException, Delete, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express'; // Importante para descargas
import { OrdenesService } from './ordenes.service';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/usuarios/guards/roles.guard';
import { Roles } from 'src/usuarios/decorators/roles.decorator';
import { PdfService } from '../pdf/pdf.service'; // 👈 Inyectamos la "impresora"

@Controller('ordenes')
export class OrdenesController {
  constructor(
    private readonly ordenesService: OrdenesService,
    private readonly pdfService: PdfService // 👈 Inyectado aquí
  ) { }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  getAll() {
    return this.ordenesService.findAll();
  }

  @Post()
  async crearOrden(@Body() dto: CreateOrdenDto) {
    return this.ordenesService.crearOrden(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('usuario')
  async listarPorUsuario(
    @Query('usuario_id') usuario_id: number,
    @Req() req
  ) {
    const user = req.user;

    // Si no es admin y quiere ver órdenes de otro usuario, bloquear
    if (user.role !== 'admin' && user.userId !== usuario_id) {
      throw new UnauthorizedException('No autorizado');
    }

    return this.ordenesService.listarPorUsuario(usuario_id);
  }

  @Get('anonimo')
  async listarPorSession(@Query('session_id') session_id: string) {
    return this.ordenesService.listarPorSession(session_id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id/estado')
  actualizarEstado(@Param('id') id: number, @Body() dto: UpdateEstadoDto) {
    return this.ordenesService.actualizarEstado(id, dto.estado);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.ordenesService.eliminar(id);
  }

  @Patch(':id/datos')
  actualizarDatosCliente(
    @Param('id') id: number,
    @Body() dto: UpdateEstadoDto
  ) {
    return this.ordenesService.actualizarDatosCliente(id, dto);
  }

  @UseGuards(AuthGuard('jwt')) // Protegido (usuario logueado)
  @Get(':id/pdf')
  async descargarFactura(
    @Param('id') id: number, 
    @Res() res: Response,
    @Req() req
  ) {
    // 1. Buscamos la orden
    const orden = await this.ordenesService.findOne(id);
    if (!orden) throw new NotFoundException('Orden no encontrada');

    // 2. Seguridad: Solo el dueño o un Admin pueden descargar
    const user = req.user;
    const esAdmin = user.role === 'admin';
    const esDueno = orden.usuario && orden.usuario.id === user.userId;

    if (!esAdmin && !esDueno) {
      throw new UnauthorizedException('No puedes descargar facturas ajenas');
    }

    // 3. Preparamos datos del cliente para el PDF
    const datosCliente = {
      nombre: orden.nombre_cliente || (orden.usuario ? orden.usuario.nombre + ' ' + orden.usuario.apellido : 'Cliente'),
      direccion: orden.direccion || 'Dirección no registrada',
      telefono: orden.telefono || 'Sin teléfono'
    };

    // 4. Generamos el PDF usando el servicio compartido
    const nombreArchivo = `factura-artemania-${orden.id}.pdf`;
    
    try {
      const rutaArchivo = await this.pdfService.generarFactura(orden, datosCliente, nombreArchivo);

      // 5. Enviamos el archivo al navegador
      res.download(rutaArchivo, nombreArchivo, (err) => {
        if (err) {
          console.error('Error al descargar:', err);
          if (!res.headersSent) res.status(500).send('Error al descargar archivo');
        }
      });
    } catch (error) {
      console.error('Error generando PDF:', error);
      res.status(500).send('Error al generar la factura');
    }
  }
}