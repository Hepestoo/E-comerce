import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductoService, Producto, ProductoDTO } from '../../../services/producto.service';
import Swal from 'sweetalert2';

// --- PASO 1: Importa el environment ---
// Asumo 5 niveles (productos -> admin -> pages -> app -> src)
import { environment } from "../../../../environments/environments";


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  subcategorias: any[] = [];
  busqueda: string = '';

  // --- PASO 2: Define la URL de la API (pública para el HTML) ---
  public apiUrl = environment.apiUrl;

  imagenPreview: string | null = null;
  imagenSeleccionada: File | null = null;

  nuevoProducto: ProductoDTO = {
// ... (resto del código sin cambios)
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    subcategoria_id: 0
  };

  constructor(private productoService: ProductoService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarsubCategorias();
  }

  cargarProductos() {
    // Esta llamada está bien (usa el servicio ya corregido)
    this.productoService.listar().subscribe((res) => {
      this.productos = res;
    });
  }

  cargarsubCategorias() {
    // --- CORREGIDO (Problema 1) ---
    this.http.get<any[]>(`${this.apiUrl}/subcategorias`).subscribe((res) => {
      this.subcategorias = res;
    });
  }

  onFileChange(event: any) {
// ... (resto del código sin cambios)
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;

      // Vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    if (this.imagenSeleccionada) {
      const formData = new FormData();
      formData.append('imagen', this.imagenSeleccionada);
  
      // --- CORREGIDO (Problema 2) ---
      this.http.post<{ imagen_url: string }>(`${this.apiUrl}/productos/upload`, formData).subscribe(res => {
        this.nuevoProducto.imagen_url = res.imagen_url;
        this.procesarGuardar();
      });
    } else {
      this.procesarGuardar();
    }
  }
  
  procesarGuardar() {
// ... (resto del código sin cambios)
    const esNuevo = !this.nuevoProducto.id;
  
    // Esta llamada está bien (usa el servicio ya corregido)
    const observable = esNuevo
      ? this.productoService.crear(this.nuevoProducto)
      // ...
      : this.productoService.actualizar(this.nuevoProducto.id!, this.nuevoProducto);
  
    observable.subscribe(() => {
      this.resetFormulario();
      this.cargarProductos();
  
      Swal.fire({
// ... (resto del código sin cambios)
        icon: 'success',
        title: esNuevo ? 'Producto creado' : 'Producto actualizado',
        text: esNuevo
          ? 'El producto ha sido agregado correctamente.'
          : 'El producto ha sido actualizado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    });
  }

  resetFormulario() {
// ... (resto del código sin cambios)
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      subcategoria_id: 0
    };
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
  }

  eliminar(id: number) {
    Swal.fire({
// ... (resto del código sin cambios)
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el producto permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Esta llamada está bien (usa el servicio ya corregido)
        this.productoService.eliminar(id).subscribe(() => {
          this.cargarProductos();
          Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
        });
      }
    });
  }

  editar(producto: Producto) {
    this.nuevoProducto = {
// ... (resto del código sin cambios)
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      subcategoria_id: producto.subcategoria.id??0,
      imagen_url: producto.imagen_url
    };

    if (producto.imagen_url) {
      // --- CORREGIDO (Problema 3) ---
      this.imagenPreview = `${this.apiUrl}/uploads/productos/${producto.imagen_url}`;
    } else {
      this.imagenPreview = null;
    }
    this.imagenSeleccionada = null;
  }

  obtenerPorSubcategoria(id: number) {
    // --- CORREGIDO (Problema 4) ---
    return this.http.get<Producto[]>(`${this.apiUrl}/productos/subcategoria/${id}`);
  }

  get productosFiltrados() {
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }
  
}