import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subcategoria, SubcategoriaService } from '../../../../services/subcategorias.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  subcategorias: Subcategoria[] = [];

  constructor(private subcategoriaService: SubcategoriaService) {}

  ngOnInit(): void {
    this.subcategoriaService.listar().subscribe({
      next: (data) => {
        // Opcional: Si tienes muchas subcategorías, muestra solo las primeras 5 o 6 para no alargar el footer
        this.subcategorias = data.slice(0, 6); 
      },
      error: (err) => console.error('Error al cargar subcategorías', err),
    });
  }
}