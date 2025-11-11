import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Producto, ProductoService } from '../../../services/producto.service';
import { SubcategoriaService } from '../../../services/subcategorias.service';
import { CarritoService } from '../../../services/carrito.service';

// --- PASO 1: Importa el environment ---
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent implements OnInit {
  subcategorias: any[] = [];
  productos: Producto[] = [];
  productosOriginal: Producto[] = [];
  cantidades: { [id: number]: number } = {};
  subcategoriaSeleccionada: number | null = null;

  // --- PASO 2: Haz pública la URL de la API para el HTML ---
  public apiUrl = environment.apiUrl;

  // Paginación
  paginaActual: number = 1;
// ... (resto del código sin cambios)
  productosPorPagina: number = 16;
  paginas: number[] = [];

  constructor(
    private productoService: ProductoService,
    private subcategoriaService: SubcategoriaService,
    private carritoService: CarritoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Cargar subcategorías (usa el servicio ya corregido)
    this.subcategoriaService.listar().subscribe((res) => {
// ... (resto del código sin cambios)
      this.subcategorias = res;

      // 2. Verificar si hay query param "sub" y cargar productos
      this.route.queryParams.subscribe(params => {
        const subId = parseInt(params['sub'], 10);

        if (subId && this.subcategorias.some(sc => sc.id === subId)) {
          this.seleccionarSubcategoria(subId);
        } else if (this.subcategorias.length > 0) {
          this.seleccionarSubcategoria(this.subcategorias[0].id);
        }
      });
    });

    this.generarSessionIdSiNoExiste();
  }

  generarSessionIdSiNoExiste() {
// ... (resto del código sin cambios)
    const id = localStorage.getItem('session_id');
    if (!id) {
      const nuevoId = crypto.randomUUID();
      localStorage.setItem('session_id', nuevoId);
    }
  }

  seleccionarSubcategoria(id: number) {
    this.subcategoriaSeleccionada = id;
    this.paginaActual = 1;

    // (usa el servicio ya corregido)
    this.productoService.obtenerPorSubcategoria(id).subscribe((res) => {
      this.productosOriginal = res;
      this.productos = [...res];
// ... (resto del código sin cambios)
      this.generarPaginas();

      // Actualizar URL con query param
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { sub: id },
        queryParamsHandling: 'merge'
      });
    });
  }

  agregarAlCarrito(producto: Producto) {
// ... (resto del código sin cambios)
    const cantidad = this.cantidades[producto.id] || 1;
  
    if (cantidad > producto.stock) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad no válida',
        text: 'La cantidad supera el stock disponible.',
      });
      return;
    }
  
    Swal.fire({
// ... (resto del código sin cambios)
      title: `¿Agregar ${producto.nombre} al carrito?`,
      text: `Cantidad: ${cantidad}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const session_id = localStorage.getItem('session_id')!;
  
        // (usa el servicio ya corregido)
        this.carritoService.agregarProducto(producto.id, cantidad, session_id).subscribe({
          next: () => {
// ... (resto del código sin cambios)
            Swal.fire({
              icon: 'success',
              title: 'Producto agregado',
              text: `${producto.nombre} fue añadido correctamente al carrito.`,
              showConfirmButton: false,
              timer: 1600
            });
            this.cantidades[producto.id] = 1;
            this.carritoService.refrescarCantidad();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al agregar el producto al carrito.',
            });
          }
        });
      }
    });
  }
  
  

  // Paginación
  generarPaginas() {
// ... (resto del código sin cambios)
    const totalPaginas = Math.ceil(this.productos.length / this.productosPorPagina);
    this.paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }

  get productosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    return this.productos.slice(inicio, fin);
  }

  paginaSiguiente() {
// ... (resto del código sin cambios)
    if (this.paginaActual < this.paginas.length) {
      this.paginaActual++;
    }
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  irAPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  // Filtro por precio
  filtrarPorPrecio(min: number, max: number) {
// ... (resto del código sin cambios)
    this.productos = this.productosOriginal.filter(
      (p) => p.precio >= min && p.precio <= max
    );
    this.paginaActual = 1;
    this.generarPaginas();
  }

  terminoBusqueda: string = '';

buscarProducto() {
  const termino = this.terminoBusqueda.trim().toLowerCase();

  if (termino === '') {
// ... (resto del código sin cambios)
    this.productos = [...this.productosOriginal];
  } else {
    this.productos = this.productosOriginal.filter(producto =>
      producto.nombre.toLowerCase().includes(termino)
    );
  }

  this.paginaActual = 1;
  this.generarPaginas();
}
}