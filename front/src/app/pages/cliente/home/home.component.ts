import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductoService, Producto } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { SubcategoriaService } from '../../../services/subcategorias.service';

// --- PASO 1: Importa el environment ---
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  cursos: Producto[] = [];
  subcategorias: any[] = [];

  // --- PASO 2: Haz pública la URL de la API para el HTML ---
  public apiUrl = environment.apiUrl;

  @ViewChild('carousel', { static: false }) carouselRef!: ElementRef;

  constructor(
    private productoService: ProductoService,
    private subcategoriaService: SubcategoriaService
  ) {}

  ngOnInit(): void {
    // Esto ya no necesita 'localhost' (asumiendo que arreglaremos el servicio)
    this.productoService.listar().subscribe((productos) => {
      this.cursos = productos.filter(
        (p) => p.subcategoria?.nombre?.toLowerCase() === 'cursos' || p.subcategoria?.nombre?.toLowerCase() === 'talleres'
      );
    });

    // Esto ya no necesita 'localhost' (asumiendo que arreglaremos el servicio)
    this.subcategoriaService.listar().subscribe((res: any) => {
      this.subcategorias = res;
    });
  }

  ngAfterViewInit(): void {
    this.scrollAutomatico();
  }

  scrollAutomatico() {
    // ... (tu código de scroll sin cambios)
    const carousel = this.carouselRef.nativeElement;
    setInterval(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScroll) {
        carousel.scrollLeft = 0;
      } else {
        carousel.scrollLeft += 1;
      }
    }, 15); // velocidad
  }
}