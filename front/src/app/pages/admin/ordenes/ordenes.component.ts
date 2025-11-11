import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdenService, Orden } from '../../../services/ordenes.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.scss'
})
export class OrdenesComponent implements OnInit {
  ordenes: Orden[] = [];
  constructor(private ordenService: OrdenService) { }

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.ordenService.listar().subscribe((res) => {
      this.ordenes = res;
    });
  }

  cambiarEstado(id: number, nuevoEstado: string) {
    this.ordenService.actualizarEstado(id, nuevoEstado).subscribe(() => {
      this.cargarOrdenes();
    });
  }

  ordenSeleccionada: Orden | null = null;

  verDetalles(orden: Orden) {
    this.ordenSeleccionada = orden;
  }

  cerrarDetalles() {
    this.ordenSeleccionada = null;
  }

  eliminarOrden(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la orden de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordenService.eliminar(id).subscribe(() => {
          this.cargarOrdenes();
          Swal.fire('Eliminado', 'La orden ha sido eliminada.', 'success');
        });
      }
    });
  }

  generarReporte(orden: Orden) {
    const doc = new jsPDF();

    //Título principal
    doc.setFontSize(22);
    doc.text('Resumen de Orden', 14, 20);

    //Datos de la orden y cliente
    doc.setFontSize(12);
    doc.text(`Numero de orden: ${orden.id}`, 14, 35);
    doc.text(`Cliente: ${orden.nombre_cliente || 'No registrado'}`, 14, 42);
    doc.text(`Teléfono: ${orden.telefono || 'No registrado'}`, 14, 49);
    doc.text(`Dirección: ${orden.direccion || 'No registrada'}`, 14, 56);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 14, 63);

    //Tabla de productos
    autoTable(doc, {
      startY: 70,
      head: [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
      body: orden.detalles.map(d => [
        d.producto.nombre,
        d.cantidad.toString(),
        `$${d.precio_unitario}`,
        `$${d.subtotal}`
      ]),
      styles: { halign: 'center' },
      headStyles: { fillColor: [41, 128, 185] }
    });

    //Final de la tabla
    const finalY = (doc as any).lastAutoTable.finalY || 70;

    //Resumen de totales y pagos
    const resumenX = 120; // Alinear hacia la derecha
    const espacioY = finalY + 10;

    doc.setFontSize(12);
    doc.text('Resumen de pago:', resumenX, espacioY);

    doc.setFontSize(11);
    doc.text(`Método de pago: ${orden.pagos?.[0]?.metodo?.nombre || 'No registrado'}`, resumenX, espacioY + 8);
    doc.text(`Subtotal: $${orden.total}`, resumenX, espacioY + 16);
    doc.text(`Total: $${orden.total}`, resumenX, espacioY + 24);

    // 💾 Guardar PDF
    doc.save(`orden_${orden.id}.pdf`);
  }







}
