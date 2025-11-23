import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductoService, Producto } from '../../../services/producto.service';
import { SubcategoriaService, Subcategoria } from '../../../services/subcategorias.service';
import { CarritoService } from '../../../services/carrito.service';
import { environment } from '../../../../environments/environments';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  productosOriginales: Producto[] = [];
  productosPaginados: Producto[] = [];
  
  subcategorias: Subcategoria[] = [];
  subcategoriaSeleccionada: number | null = null;
  
  terminoBusqueda: string = '';
  cantidades: { [key: number]: number } = {};
  
  paginaActual: number = 1;
  elementosPorPagina: number = 12;
  paginas: number[] = [];

  apiUrl = environment.apiUrl;

  constructor(
    private productoService: ProductoService,
    private subcategoriaService: SubcategoriaService,
    private carritoService: CarritoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.subcategoriaService.listar().subscribe(subs => {
      this.subcategorias = subs;
    });

    this.productoService.listar().subscribe(prods => {
      this.productosOriginales = prods;
      this.productos = prods;
      
      this.productos.forEach(p => this.cantidades[p.id] = 1);

      this.route.queryParams.subscribe(params => {
        if (params['sub']) {
          this.seleccionarSubcategoria(+params['sub']);
        } else {
          this.actualizarPaginacion();
        }
      });
    });
  }

  buscarProducto() {
    const termino = this.terminoBusqueda.toLowerCase();
    this.productos = this.productosOriginales.filter(p => 
      p.nombre.toLowerCase().includes(termino) || 
      p.descripcion.toLowerCase().includes(termino)
    );
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  seleccionarSubcategoria(id: number | null) {
    this.subcategoriaSeleccionada = id;
    this.terminoBusqueda = '';

    if (id === null) {
      this.productos = [...this.productosOriginales];
    } else {
      this.productos = this.productosOriginales.filter(p => p.subcategoria?.id === id);
    }
    
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  filtrarPorPrecio(min: number, max: number) {
    let base = this.productosOriginales;
    
    if (this.subcategoriaSeleccionada !== null) {
      base = base.filter(p => p.subcategoria?.id === this.subcategoriaSeleccionada);
    }

    this.productos = base.filter(p => {
      const precio = parseFloat(p.precio.toString());
      return precio >= min && precio <= max;
    });

    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    const totalPaginas = Math.ceil(this.productos.length / this.elementosPorPagina);
    this.paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
    
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.productosPaginados = this.productos.slice(inicio, fin);
  }

  irAPagina(pagina: number) {
    this.paginaActual = pagina;
    this.actualizarPaginacion();
    window.scrollTo(0, 0);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.irAPagina(this.paginaActual - 1);
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.paginas.length) {
      this.irAPagina(this.paginaActual + 1);
    }
  }

  agregarAlCarrito(producto: Producto) {
    const cantidad = this.cantidades[producto.id] || 1;
    
    if (cantidad > producto.stock) {
      Swal.fire('Error', `Solo hay ${producto.stock} unidades disponibles`, 'error');
      return;
    }

    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('session_id', sessionId);
    }

    // CORRECCIÓN: Enviamos producto.id en lugar del objeto producto completo
    // TypeScript se quejaba porque esperaba un number y recibía un objeto Producto
    this.carritoService.agregarProducto(producto.id, cantidad, sessionId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Agregado',
          text: `${producto.nombre} se añadió al carrito`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          background: '#fff',
          iconColor: '#7951a8'
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo agregar al carrito', 'error');
      }
    });
  }
}