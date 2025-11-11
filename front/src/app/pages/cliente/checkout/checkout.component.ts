import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../../services/carrito.service';
import { Router } from '@angular/router';
import { OrdenService } from '../../../services/ordenes.service';
import { PagosService } from '../../../services/pagos.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  carrito: any = { items: [] }; // Info del carrito actual
  resumenOrden: any = null;     // Datos resumidos (no se usa en este ejemplo)
  mostrarResumen: boolean = false; // Para alternar entre resumen o formulario
  orden: any = null;            // Orden generada previamente

  // Información del cliente
  datosCliente = {
    nombre: '',
    telefono: '',
    direccion: ''
  };

  metodosPago: any[] = [];                // Lista de métodos de pago
  metodoPagoSeleccionado: number | null = null; // Método seleccionado por el usuario

  constructor(
    private carritoService: CarritoService,
    private ordenService: OrdenService,
    private pagosService: PagosService,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener orden generada almacenada en localStorage
    const ordenStr = localStorage.getItem('orden_generada');
    if (ordenStr) {
      this.orden = JSON.parse(ordenStr);
    }
  
    // Obtener métodos de pago desde el backend
    this.pagosService.listarMetodosPago().subscribe((res) => {
      this.metodosPago = res;
      console.log('Métodos de pago cargados:', this.metodosPago); // 👈 AGREGA ESTO
    });
  
    // Si hay datos del cliente previamente guardados, los carga
    const datosGuardados = localStorage.getItem('datosCliente');
    if (datosGuardados) {
      this.datosCliente = JSON.parse(datosGuardados);
    }
  }
  

  // Botón para volver al inicio y limpiar la orden y datos guardados
  volverInicio() {
    localStorage.removeItem('orden_generada');
    localStorage.removeItem('datosCliente');
    this.router.navigate(['/home']);
  }

  // Finalizar compra: valida los datos, actualiza cliente y registra pago
  finalizarCompra(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
  
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos y selecciona un método de pago.'
      });
  
      return;
    }
  
    // Guardar datos del cliente en la orden
    this.ordenService.actualizarDatosCliente(this.orden.id, {
      nombre_cliente: this.datosCliente.nombre,
      direccion: this.datosCliente.direccion,
      telefono: this.datosCliente.telefono
    }).subscribe({
      next: () => {
        console.log('Método de pago seleccionado:', this.metodoPagoSeleccionado);


        // Luego registrar el pago
        this.pagosService.crearPago({
          orden_id: this.orden.id,
          metodo_pago_id: this.metodoPagoSeleccionado!,
          monto: this.orden.total,
          estado: 'pendiente'
        }).subscribe({
          next: () => {
            // Vaciar el carrito
            const session_id = localStorage.getItem('session_id');
            if (session_id) {
              this.carritoService.vaciarCarrito(session_id).subscribe(() => {
                this.carritoService.refrescarCantidad();
              });
            }
  
            Swal.fire({
              icon: 'success',
              title: '¡Compra exitosa!',
              text: 'Tu pago ha sido registrado. Pronto te contactaremos para coordinar el envío.'
            }).then(() => {
              this.volverInicio();
            });
          },
          error: () => {
            Swal.fire('Error', 'Ocurrió un error al registrar el pago', 'error');
          }
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar los datos del cliente', 'error');
      }
    });
  
    localStorage.setItem('datosCliente', JSON.stringify(this.datosCliente));
  }
  
  
}
