import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../../../services/carrito.service';
import { OrdenService } from '../../../services/ordenes.service';
import { PagosService } from '../../../services/pagos.service';
import { environment } from '../../../../environments/environments';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  @ViewChild('checkoutForm') checkoutForm!: NgForm;

  carrito: any = { items: [] };
  session_id: string = '';
  
  // Datos para el formulario
  datosCliente = {
    nombre: '',
    telefono: '',
    direccion: ''
  };
  
  metodosPago: any[] = [];
  metodoPagoSeleccionado: number | null = null;
  
  loading = false;
  apiUrl = environment.apiUrl;

  constructor(
    private carritoService: CarritoService,
    private ordenService: OrdenService,
    private pagosService: PagosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session_id = localStorage.getItem('session_id') || this.generarSessionId();
    this.obtenerCarrito();
    this.cargarMetodosPago();
    this.cargarDatosCliente();
  }

  generarSessionId(): string {
    const id = crypto.randomUUID();
    localStorage.setItem('session_id', id);
    return id;
  }

  obtenerCarrito() {
    this.carritoService.getCarrito(this.session_id).subscribe(res => {
      this.carrito = res;
    });
  }

  cargarMetodosPago() {
    this.pagosService.listarMetodosPago().subscribe({
      next: (res) => this.metodosPago = res,
      error: () => {
        // Fallback si falla el backend
        this.metodosPago = [
          { id: 1, nombre: 'Transferencia' },
          { id: 2, nombre: 'Efectivo' }
        ];
      }
    });
  }

  cargarDatosCliente() {
    const datos = localStorage.getItem('datosCliente');
    if (datos) {
      this.datosCliente = JSON.parse(datos);
    }
  }

  eliminarItem(id: number) {
    Swal.fire({
      title: '¿Eliminar?',
      text: "Se quitará del carrito",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#7951a8',
      confirmButtonText: 'Sí, eliminar',
      customClass: { popup: 'rounded-alert', confirmButton: 'rounded-btn-alert-error' }
    }).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.eliminarItem(id).subscribe(() => {
          this.obtenerCarrito();
        });
      }
    });
  }

  vaciarCarrito() {
    Swal.fire({
      title: '¿Vaciar todo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#7951a8',
      confirmButtonText: 'Vaciar',
      customClass: { popup: 'rounded-alert' }
    }).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.vaciarCarrito(this.session_id).subscribe(() => {
          this.obtenerCarrito();
        });
      }
    });
  }

  calcularTotal(): number {
    if (!this.carrito.items) return 0;
    return this.carrito.items.reduce(
      (acc: number, item: any) => acc + (item.cantidad * item.producto.precio), 0
    );
  }

  // --- LA MAGIA: TODO EN UNO ---
  procesarPedidoCompleto() {
    // 1. Validaciones
    if (this.checkoutForm.invalid) {
      // Marcar campos como tocados para mostrar errores visuales si los hubiera
      Object.values(this.checkoutForm.controls).forEach(control => control.markAsTouched());
      Swal.fire({
        title: 'Faltan datos',
        text: 'Por favor completa tu información de envío.',
        icon: 'warning',
        confirmButtonColor: '#7951a8',
        customClass: { popup: 'rounded-alert', confirmButton: 'rounded-btn-alert' }
      });
      return;
    }

    if (!this.metodoPagoSeleccionado) {
      Swal.fire({
        title: 'Pago',
        text: 'Selecciona un método de pago.',
        icon: 'warning',
        confirmButtonColor: '#7951a8',
        customClass: { popup: 'rounded-alert', confirmButton: 'rounded-btn-alert' }
      });
      return;
    }

    this.loading = true;
    localStorage.setItem('datosCliente', JSON.stringify(this.datosCliente));

    // 2. Flujo de Checkout Automático
    
    // A. Crear Orden
    this.ordenService.crearOrden({ session_id: this.session_id }).subscribe({
      next: (orden) => {
        
        // B. Actualizar Datos Cliente
        this.ordenService.actualizarDatosCliente(orden.id, {
          nombre_cliente: this.datosCliente.nombre,
          direccion: this.datosCliente.direccion,
          telefono: this.datosCliente.telefono
        }).subscribe({
          next: () => {
            
            // C. Crear Pago
            this.pagosService.crearPago({
              orden_id: orden.id,
              metodo_pago_id: this.metodoPagoSeleccionado!,
              monto: orden.total,
              estado: 'pendiente'
            }).subscribe({
              next: () => {
                
                // D. Finalizar (Vaciar carrito y avisar)
                this.carritoService.vaciarCarrito(this.session_id).subscribe();
                this.carritoService.refrescarCantidad(); // Resetear contador navbar
                
                this.loading = false;
                
                Swal.fire({
                  icon: 'success',
                  title: '¡Pedido Confirmado! 🎉',
                  text: `Orden #${orden.id} registrada correctamente.`,
                  confirmButtonText: 'Volver al Inicio',
                  confirmButtonColor: '#7951a8',
                  background: '#fff',
                  customClass: { popup: 'rounded-alert', confirmButton: 'rounded-btn-alert' }
                }).then(() => {
                  // Opcional: Generar nuevo session_id para empezar limpio
                  localStorage.removeItem('session_id'); 
                  this.router.navigate(['/home']);
                });
              },
              error: () => {
                this.loading = false;
                Swal.fire('Error', 'Falló el registro del pago.', 'error');
              }
            });
          },
          error: () => {
            this.loading = false;
            Swal.fire('Error', 'No se guardaron los datos de envío.', 'error');
          }
        });
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudo crear la orden.', 'error');
      }
    });
  }
}