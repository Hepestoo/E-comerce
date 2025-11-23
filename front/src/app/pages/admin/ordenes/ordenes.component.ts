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
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {
  ordenes: Orden[] = [];
  ordenSeleccionada: Orden | null = null;

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
      // Feedback visual rápido (Toast)
      const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
      Toast.fire({ icon: 'success', title: 'Estado actualizado' });
      
      this.cargarOrdenes();
    });
  }

  verDetalles(orden: Orden) {
    this.ordenSeleccionada = orden;
  }

  cerrarDetalles() {
    this.ordenSeleccionada = null;
  }

  eliminarOrden(id: number) {
    Swal.fire({
      title: '¿Eliminar orden?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      customClass: { popup: 'rounded-alert' } // Usando tus clases globales
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

    // Encabezado elegante
    doc.setFillColor(121, 81, 168); // Tu color morado #7951a8
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('ARTEMANIA', 14, 20);
    doc.setFontSize(12);
    doc.text('Reporte de Orden', 14, 30);

    // Info Cliente
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Orden #${orden.id}`, 14, 50);
    doc.text(`Fecha: ${new Date(orden.fecha_creacion).toLocaleDateString()}`, 14, 56);
    
    doc.text(`Cliente: ${orden.nombre_cliente || 'N/A'}`, 120, 50);
    doc.text(`Teléfono: ${orden.telefono || 'N/A'}`, 120, 56);
    doc.text(`Dirección: ${orden.direccion || 'N/A'}`, 120, 62);

    // Tabla
    autoTable(doc, {
      startY: 70,
      head: [['Producto', 'Cant', 'Unitario', 'Total']],
      body: orden.detalles.map(d => [
        d.producto.nombre,
        d.cantidad,
        `$${d.precio_unitario}`,
        `$${d.subtotal}`
      ]),
      headStyles: { fillColor: [121, 81, 168] }, // Morado
      theme: 'grid'
    });

    // Totales
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total a Pagar: $${orden.total}`, 140, finalY);

    doc.save(`orden_${orden.id}.pdf`);
  }
}