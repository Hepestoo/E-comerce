import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante para ngModel
import { MetodosPagoService, MetodoPago } from '../../../services/metodos-pago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metodos-pago',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './metodos-pago.component.html',
  styleUrls: ['./metodos-pago.component.scss']
})
export class MetodosPagoComponent implements OnInit {
  metodos: MetodoPago[] = [];
  mostrarFormulario = false;

  nuevoMetodo: Partial<MetodoPago> = {
    nombre: '',
    descripcion: ''
  };

  constructor(private metodosService: MetodosPagoService) {}

  ngOnInit(): void {
    this.cargarMetodos();
  }

  cargarMetodos() {
    this.metodosService.listar().subscribe(res => {
      this.metodos = res;
    });
  }

  guardar() {
    if (!this.nuevoMetodo.nombre) return;

    const peticion = this.nuevoMetodo.id 
      ? this.metodosService.actualizar(this.nuevoMetodo.id, this.nuevoMetodo)
      : this.metodosService.crear(this.nuevoMetodo);

    peticion.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Guardado',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-alert' }
        });
        this.resetForm();
        this.cargarMetodos();
        this.mostrarFormulario = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo guardar el método de pago', 'error');
      }
    });
  }

  editar(metodo: MetodoPago) {
    this.nuevoMetodo = { ...metodo };
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Si eliminas este método, los clientes ya no podrán elegirlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      customClass: { popup: 'rounded-alert', confirmButton: 'rounded-btn-alert-error' }
    }).then((result) => {
      if (result.isConfirmed) {
        this.metodosService.eliminar(id).subscribe(() => {
          this.cargarMetodos();
          Swal.fire({
            title: 'Eliminado',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-alert' }
          });
        });
      }
    });
  }

  resetForm() {
    this.nuevoMetodo = { nombre: '', descripcion: '' };
  }
}