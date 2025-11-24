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
  categoriasPadre: any[] = [];      // Lista de Categorías (Padre)
  todasSubcategorias: any[] = [];   // Lista cruda de todas las subcategorías
  subcategoriasFiltradas: any[] = []; // Lista filtrada para el Select 2
  
  categoriaPadreSeleccionadaId: number | null = null; // Variable temporal para el Select 1

  busqueda: string = '';
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
    this.cargarDatosSelects();
  }

  cargarProductos() {
    this.productoService.listar().subscribe((res) => {
      this.productos = res;
    });
  }

  cargarDatosSelects() {
    // 1. Cargar Categorías Padre (Select 1)
    this.productoService.obtenerCategoriasPadre().subscribe(res => {
      this.categoriasPadre = res;
    });

    // 2. Cargar Todas las Subcategorías (Para filtrar el Select 2)
    this.productoService.obtenerSubcategorias().subscribe(res => {
      this.todasSubcategorias = res;
      this.subcategoriasFiltradas = []; // Empieza vacío hasta que elijan categoría
    });
  }

  // EVENTO: Se ejecuta cuando cambian la Categoría Principal
  onCategoriaPadreChange() {
    // Reseteamos el hijo
    this.nuevoProducto.subcategoria_id = 0;
    
    if (this.categoriaPadreSeleccionadaId) {
      // Filtramos: Mostramos solo las subcategorías que coincidan con el padre ID
      this.subcategoriasFiltradas = this.todasSubcategorias.filter(sub => 
        sub.categoria && sub.categoria.id == this.categoriaPadreSeleccionadaId
      );
    } else {
      this.subcategoriasFiltradas = [];
    }
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
    event.stopPropagation();
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
  }

  guardar() {
    // Validación de imagen solo si es nuevo
    if (!this.nuevoProducto.id && !this.imagenSeleccionada) {
      Swal.fire('Falta Imagen', 'Debes subir una imagen para el producto', 'warning');
      return;
    }
    
    // Validación de categoría
    if (!this.nuevoProducto.subcategoria_id || this.nuevoProducto.subcategoria_id === 0) {
      Swal.fire('Falta Categoría', 'Debes seleccionar un tipo de producto (subcategoría)', 'warning');
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
      this.mostrarFormulario = false;
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
    // Reseteamos selects en cascada
    this.categoriaPadreSeleccionadaId = null;
    this.subcategoriasFiltradas = [];
    
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

    // --- LÓGICA PARA AUTO-SELECCIONAR LOS SELECTS ---
    // 1. Buscamos en la lista completa a qué categoría pertenece esta subcategoría
    const subActual = this.todasSubcategorias.find(s => s.id === producto.subcategoria.id);
    
    if (subActual && subActual.categoria) {
      // 2. Seteamos el Padre
      this.categoriaPadreSeleccionadaId = subActual.categoria.id;
      // 3. Forzamos la actualización del segundo select
      this.onCategoriaPadreChange();
      // 4. Volvemos a marcar el hijo (porque el change lo borra)
      this.nuevoProducto.subcategoria_id = producto.subcategoria.id;
    }

    if (producto.imagen_url) {
      this.imagenPreview = `${this.apiUrl}/uploads/productos/${producto.imagen_url}`;
    } else {
      this.imagenPreview = null;
    }
    this.imagenSeleccionada = null;
    
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get productosFiltrados() {
    if (!this.busqueda) return this.productos;
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }
}