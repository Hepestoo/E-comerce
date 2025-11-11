import { Injectable } from '@nestjs/common';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generarFactura(orden: any, datosCliente: any, nombreArchivo: string): Promise<string> {
    const doc = new jsPDF();

    // Título principal
    doc.setFontSize(20);
    doc.text('Resumen de Orden', 15, 20);

    // Información del cliente
    doc.setFontSize(12);
    const infoCliente = [
      `Número de orden: ${orden.id}`,
      `Cliente: ${datosCliente.nombre || 'No registrado'}`,
      `Teléfono: ${datosCliente.telefono || 'No registrado'}`,
      `Dirección: ${datosCliente.direccion || 'No registrado'}`,
      `Fecha de emisión: ${new Date(orden.fecha_creacion).toLocaleDateString()}`,
    ];

    let y = 30;
    infoCliente.forEach((linea) => {
      doc.text(linea, 15, y);
      y += 8;
    });

    // Tabla de productos
    autoTable(doc, {
      startY: y + 5,
      head: [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
      body: orden.detalles.map((d) => [
        d.producto.nombre,
        d.cantidad,
        `$${Number(d.precio_unitario).toFixed(2)}`,
        `$${Number(d.subtotal).toFixed(2)}`,
      ]),
      styles: { halign: 'center' },
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Resumen de pago
    const resumenY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('Resumen de pago:', 140, resumenY);

    doc.setFontSize(11);
    const metodoPago = orden.pagos?.[0]?.metodo?.nombre || 'No registrado';
    doc.text(`Método de pago: ${metodoPago}`, 140, resumenY + 8);
    doc.text(`Subtotal: $${Number(orden.total).toFixed(2)}`, 140, resumenY + 16);
    doc.text(`Total: $${Number(orden.total).toFixed(2)}`, 140, resumenY + 24);

    // Guardar archivo en el servidor
    const uploadsPath = path.join(__dirname, '..', '..', 'uploads', 'pdfs');
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    const fullPath = path.join(uploadsPath, nombreArchivo);
    fs.writeFileSync(fullPath, Buffer.from(doc.output('arraybuffer')));

    //Programar eliminación del archivo en 1 minuto
    setTimeout(() => {
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error('Error al eliminar el PDF:', err);
          } else {
            console.log(`Archivo eliminado automáticamente: ${nombreArchivo}`);
          }
        });
      }
    }, 60000); 

    return fullPath;
  }
}
