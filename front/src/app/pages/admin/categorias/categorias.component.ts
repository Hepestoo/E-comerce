import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../../../services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  mostrarFormulario = false;
  
  // ✅ NUEVO: Variable para el buscador
  busqueda: string = '';

  nuevaCategoria: Partial<Categoria> = {
    nombre: '',
    descripcion: ''
  };

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.listar().subscribe(res => {
      this.categorias = res;
    });
  }

  // ✅ NUEVO: Esto filtra la lista automáticamente
  get categoriasFiltradas() {
    if (!this.busqueda.trim()) return this.categorias;
    
    return this.categorias.filter(cat => 
      cat.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      (cat.descripcion && cat.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()))
    );
  }

  guardar() {
    if (!this.nuevaCategoria.nombre) return;

    const peticion = this.nuevaCategoria.id 
      ? this.categoriaService.actualizar(this.nuevaCategoria.id, this.nuevaCategoria)
      : this.categoriaService.crear(this.nuevaCategoria);

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
        this.cargarCategorias();
        this.mostrarFormulario = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo guardar la categoría', 'error');
      }
    });
  }

  editar(cat: Categoria) {
    this.nuevaCategoria = { ...cat };
    this.mostrarFormulario = true;
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Eliminar una categoría podría afectar a los productos asociados.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      customClass: { popup: 'rounded-alert', confirmButton: 'rounded-btn-alert-error' }
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.eliminar(id).subscribe(() => {
          this.cargarCategorias();
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
    this.nuevaCategoria = { nombre: '', descripcion: '' };
  }
}