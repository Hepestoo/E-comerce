import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../services/carrito.service';
import { FormsModule } from '@angular/forms';
import { OrdenService } from '../../../services/ordenes.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// --- PASO 1: Importa el environment ---
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  carrito: any = { items: [] };
  session_id: string = '';
  ordenConfirmada: any = null;

  // --- PASO 2: Haz pública la URL de la API para el HTML ---
  public apiUrl = environment.apiUrl;

  constructor(
    private carritoService: CarritoService,
    private ordenService: OrdenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session_id = localStorage.getItem('session_id') || this.generarSessionId();
    this.obtenerCarrito();
  }

  generarSessionId(): string {
    const id = crypto.randomUUID();
    localStorage.setItem('session_id', id);
    return id;
  }

  obtenerCarrito() {
    // Esto ya está corregido gracias a que arreglamos el carrito.service
    this.carritoService.getCarrito(this.session_id).subscribe((res) => {
      this.carrito = res;
    });
  }

  eliminarItem(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
// ... (resto del código sin cambios)
      text: 'Se eliminará este producto del carrito',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.eliminarItem(id).subscribe(() => {
          this.obtenerCarrito();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Producto eliminado del carrito.',
            timer: 1500,
            showConfirmButton: false
          });
        });
      }
    });
  }

  vaciarCarrito() {
    Swal.fire({
      title: '¿Vaciar todo el carrito?',
// ... (resto del código sin cambios)
      text: 'Todos los productos serán eliminados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.vaciarCarrito(this.session_id).subscribe(() => {
          this.obtenerCarrito();
          Swal.fire({
            icon: 'success',
            title: 'Carrito vaciado',
            timer: 1500,
            showConfirmButton: false
          });
        });
      }
    });
  }

  calcularTotal(): number {
    return this.carrito.items.reduce(
      (acc: number, item: any) => acc + item.cantidad * item.producto.precio,
      0
    );
  }

  generarOrden() {
    const session_id = localStorage.getItem('session_id');
// ... (resto del código sin cambios)
    if (!session_id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener la sesión'
      });
      return;
    }

    // Esto ya está corregido gracias a que arreglamos el ordenes.service
    this.ordenService.crearOrden({ session_id }).subscribe({
      next: (orden) => {
        localStorage.setItem('orden_generada', JSON.stringify(orden));
        this.router.navigate(['/checkout']);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar la orden. Inténtalo de nuevo.'
        });
      }
    });
  }
}