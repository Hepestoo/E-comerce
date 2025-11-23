import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SubcategoriaService } from '../../../services/subcategorias.service';
import { environment } from '../../../../environments/environments';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subcategorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subcategorias.component.html',
  styleUrls: ['./subcategorias.component.scss']
})
export class SubcategoriasComponent implements OnInit {
  subcategorias: any[] = [];
  subcategoriasOriginales: any[] = []; // Para filtrar
  categorias: any[] = [];
  
  mostrarFormulario = false;
  private apiUrl = environment.apiUrl;

  nueva: { id: number | null; nombre: string; categoria_id: number } = {
    id: null,
    nombre: '',
    categoria_id: 0
  };

  constructor(
    private http: HttpClient,
    private subcategoriaService: SubcategoriaService
  ) {}

  ngOnInit(): void {
    this.listar();
    this.cargarCategorias();
  }

  listar() {
    this.subcategoriaService.listar().subscribe((res) => {
      this.subcategoriasOriginales = res;
      this.subcategorias = res;
    });
  }

  cargarCategorias() {
    this.http.get<any[]>(`${this.apiUrl}/categorias`).subscribe((res) => {
      this.categorias = res;
    });
  }

  filtrar(event: any) {
    const texto = event.target.value.toLowerCase();
    this.subcategorias = this.subcategoriasOriginales.filter(sub => 
      sub.nombre.toLowerCase().includes(texto) || 
      sub.categoria?.nombre.toLowerCase().includes(texto)
    );
  }

  guardar() {
    const dto = {
      nombre: this.nueva.nombre,
      categoria_id: +this.nueva.categoria_id
    };
  
    const observable = this.nueva.id === null 
      ? this.subcategoriaService.crear(dto)
      : this.subcategoriaService.actualizar(this.nueva.id, dto);

    observable.subscribe(() => {
      this.mostrarFormulario = false;
      this.reset();
      this.listar();
      
      Swal.fire({
        icon: 'success',
        title: this.nueva.id ? 'Actualizado' : 'Creado',
        text: 'Operación exitosa',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'rounded-alert' }
      });
    });
  }

  editar(sub: any) {
    this.nueva = {
      id: sub.id,
      nombre: sub.nombre,
      categoria_id: sub.categoria?.id ?? 0
    };
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar?',
      text: 'Esta acción es irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#7951a8',
      confirmButtonText: 'Sí, eliminar',
      customClass: { popup: 'rounded-alert', confirmButton: 'rounded-btn-alert-error' }
    }).then((result) => {
      if (result.isConfirmed) {
        this.subcategoriaService.eliminar(id).subscribe(() => {
          this.listar();
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

  reset() {
    this.nueva = { id: null, nombre: '', categoria_id: 0 };
  }
}