import { Injectable } from '@nestjs/common';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generarFactura(orden: any, datosCliente: any, nombreArchivo: string): Promise<string> {
    const doc = new jsPDF();

    // --- COLORES DE LA MARCA ---
    const primaryColor = '#7951a8'; // Tu morado
    const secondaryColor = '#f3e5f5'; // Morado muy claro para fondos
    const grayColor = '#666666';
    const blackColor = '#333333';

    // --- 1. ENCABEZADO CON ESTILO ---
    // Fondo del encabezado
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F'); // Rectángulo superior morado (A4 ancho 210)

    // Título de la empresa (Texto blanco)
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('ARTEMANIA', 15, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Tienda de Arte & Manualidades', 15, 28);

    // Etiqueta "FACTURA / ORDEN" a la derecha
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDEN DE COMPRA', 195, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.text(`#${orden.id.toString().padStart(6, '0')}`, 195, 28, { align: 'right' });

    // --- 2. INFORMACIÓN DEL CLIENTE Y FECHA ---
    let y = 55;
    
    // Columna Izquierda: Datos del Cliente
    doc.setTextColor(primaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURAR A:', 15, y);
    
    doc.setTextColor(blackColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    y += 7;
    doc.text(datosCliente.nombre || 'Cliente Anónimo', 15, y);
    y += 5;
    doc.text(datosCliente.telefono || 'Sin teléfono', 15, y);
    y += 5;
    // Dividir dirección larga si es necesario
    const direccionSplit = doc.splitTextToSize(datosCliente.direccion || 'Sin dirección', 80);
    doc.text(direccionSplit, 15, y);

    // Columna Derecha: Detalles de la Orden
    y = 55; // Reseteamos Y para la columna derecha
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DETALLES:', 120, y);

    doc.setTextColor(blackColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    y += 7;
    
    // Fecha
    doc.setTextColor(grayColor); doc.text('Fecha de Emisión:', 120, y);
    doc.setTextColor(blackColor); doc.text(new Date(orden.fecha_creacion).toLocaleDateString(), 160, y);
    y += 6;
    
    // Método de Pago
    const metodoPago = orden.pagos?.[0]?.metodo?.nombre || 'Pendiente';
    doc.setTextColor(grayColor); doc.text('Método de Pago:', 120, y);
    doc.setTextColor(blackColor); doc.text(metodoPago, 160, y);
    y += 6;

    // Estado
    doc.setTextColor(grayColor); doc.text('Estado:', 120, y);
    doc.setTextColor(blackColor); doc.text(orden.estado.toUpperCase(), 160, y);

    // --- 3. TABLA DE PRODUCTOS ---
    // Calculamos dónde empezar la tabla (debajo de la dirección del cliente)
    const startYTable = 95;

    autoTable(doc, {
      startY: startYTable,
      head: [['Producto', 'Cant.', 'Precio Unit.', 'Total']],
      body: orden.detalles.map((d) => [
        d.producto.nombre,
        d.cantidad,
        `$${Number(d.precio_unitario).toFixed(2)}`,
        `$${Number(d.subtotal).toFixed(2)}`,
      ]),
      theme: 'grid', // Líneas limpias
      headStyles: {
        fillColor: primaryColor, // Cabecera morada
        textColor: '#FFFFFF',
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
        valign: 'middle'
      },
      columnStyles: {
        0: { halign: 'left' },   // Nombre producto
        1: { halign: 'center' }, // Cantidad
        2: { halign: 'right' },  // Precio
        3: { halign: 'right', fontStyle: 'bold' } // Subtotal
      },
      alternateRowStyles: {
        fillColor: secondaryColor // Filas alternas color morado muy suave
      }
    });

    // --- 4. TOTALES ---
    // Posicionamos los totales justo debajo de la tabla
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Dibujamos un pequeño recuadro para los totales
    doc.setFillColor('#f9f9f9');
    doc.rect(130, finalY - 5, 70, 30, 'F');

    doc.setFontSize(10);
    doc.setTextColor(grayColor);
    doc.text('Subtotal:', 140, finalY + 2);
    doc.text('Envío:', 140, finalY + 8);
    
    doc.setTextColor(blackColor);
    doc.text(`$${Number(orden.total).toFixed(2)}`, 190, finalY + 2, { align: 'right' });
    doc.text(`$0.00`, 190, finalY + 8, { align: 'right' }); // Si tuvieras costo de envío

    // Línea separadora
    doc.setDrawColor('#dddddd');
    doc.line(135, finalY + 12, 195, finalY + 12);

    // TOTAL FINAL GRANDE
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 140, finalY + 20);
    doc.text(`$${Number(orden.total).toFixed(2)}`, 190, finalY + 20, { align: 'right' });

    // --- 5. PIE DE PÁGINA ---
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(1);
    doc.line(15, pageHeight - 30, 195, pageHeight - 30); // Línea inferior

    doc.setFontSize(9);
    doc.setTextColor(grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text('¡Gracias por tu compra!', 105, pageHeight - 22, { align: 'center' });
    doc.text('Si tienes dudas, contáctanos a soporte@artemania.com', 105, pageHeight - 17, { align: 'center' });

    // --- GUARDADO (Igual que antes) ---
    const uploadsPath = path.join(__dirname, '..', '..', 'uploads', 'pdfs');
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    const fullPath = path.join(uploadsPath, nombreArchivo);
    fs.writeFileSync(fullPath, Buffer.from(doc.output('arraybuffer')));

    // Eliminación automática
    setTimeout(() => {
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) console.error('Error al eliminar el PDF:', err);
        });
      }
    }, 60000); 

    return fullPath;
  }
}