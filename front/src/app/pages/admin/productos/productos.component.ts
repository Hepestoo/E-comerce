import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductoService, Producto, ProductoDTO } from '../../../services/producto.service';
import Swal from 'sweetalert2';
import { environment } from "../../../../environments/environments";

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'] 
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  subcategorias: any[] = [];
  busqueda: string = '';
  
  // Control del formulario colapsable
  mostrarFormulario = false;

  public apiUrl = environment.apiUrl;

  imagenPreview: string | null = null;
  imagenSeleccionada: File | null = null;

  nuevoProducto: ProductoDTO = {
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
    this.productoService.listar().subscribe((res) => {
      this.productos = res;
    });
  }

  cargarsubCategorias() {
    this.http.get<any[]>(`${this.apiUrl}/subcategorias`).subscribe((res) => {
      this.subcategorias = res;
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  limpiarImagen(event: Event) {
    event.stopPropagation(); // Evitar que se abra el selector de archivos
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
  }

  guardar() {
    // Validar que haya imagen si es nuevo
    if (!this.nuevoProducto.id && !this.imagenSeleccionada) {
      Swal.fire('Falta Imagen', 'Debes subir una imagen para el producto', 'warning');
      return;
    }

    if (this.imagenSeleccionada) {
      const formData = new FormData();
      formData.append('imagen', this.imagenSeleccionada);
      this.http.post<{ imagen_url: string }>(`${this.apiUrl}/productos/upload`, formData).subscribe(res => {
        this.nuevoProducto.imagen_url = res.imagen_url;
        this.procesarGuardar();
      });
    } else {
      this.procesarGuardar();
    }
  }
  
  procesarGuardar() {
    const esNuevo = !this.nuevoProducto.id;
    const observable = esNuevo
      ? this.productoService.crear(this.nuevoProducto)
      : this.productoService.actualizar(this.nuevoProducto.id!, this.nuevoProducto);
  
    observable.subscribe(() => {
      this.resetFormulario();
      this.mostrarFormulario = false; // Cerrar formulario al guardar
      this.cargarProductos();
  
      Swal.fire({
        icon: 'success',
        title: esNuevo ? 'Producto Creado' : 'Producto Actualizado',
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-alert' }
      });
    });
  }

  resetFormulario() {
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
      title: '¿Eliminar?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#7951a8',
      confirmButtonText: 'Sí, eliminar',
      customClass: { popup: 'rounded-alert', confirmButton: 'rounded-btn-alert-error' }
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminar(id).subscribe(() => {
          this.cargarProductos();
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

  editar(producto: Producto) {
    this.nuevoProducto = {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      subcategoria_id: producto.subcategoria.id ?? 0,
      imagen_url: producto.imagen_url
    };

    if (producto.imagen_url) {
      this.imagenPreview = `${this.apiUrl}/uploads/productos/${producto.imagen_url}`;
    } else {
      this.imagenPreview = null;
    }
    this.imagenSeleccionada = null;
    
    this.mostrarFormulario = true; // Abrir formulario automáticamente
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Subir al formulario
  }

  get productosFiltrados() {
    if (!this.busqueda) return this.productos;
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }
}