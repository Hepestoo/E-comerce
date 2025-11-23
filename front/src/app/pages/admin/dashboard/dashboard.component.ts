// src/app/pages/admin/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http'; // Asegúrate de que HttpClientModule esté disponible (probablemente en tu app.config.ts si es Angular 17+)

interface Order {
  id: string;
  cliente: string;
  fechaTexto: string;
  total: number;
  estado: string;
}

interface ActivityItem {
  titulo: string;
  hace: string;
  dotClass?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Agregamos HttpClientModule por si acaso, aunque normalmente va en la config global.
  imports: [CommonModule, RouterModule, HttpClientModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    ventas: 0,
    ordenes: 0,
    productos: 0,
    clientes: 0
  };

  orders: Order[] = [];
  activity: ActivityItem[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    // 1. Carga de Stats (Mantiene el polling cada 5s, ¡está bien!)
    interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.dashboardService.getStats())
      )
      .subscribe({
        next: (res) => this.stats = res,
        error: (err) => console.error('Error cargando stats', err)
      });

    // 2. ¡CORRECCIÓN CLAVE! Cargar datos de la tabla y actividad
    this.cargarOrders();
    this.cargarActivity();
  }

  /** * Carga las últimas órdenes. 
   * Si necesitas refrescar esto, puedes usar interval() como en getStats().
   */
  private cargarOrders() {
    this.dashboardService.getLatestOrders().subscribe({
      next: (res: Order[]) => this.orders = res,
      error: (err) => console.error('Error cargando órdenes', err)
    });
  }

  /** Carga la actividad reciente. */
  private cargarActivity() {
    this.dashboardService.getActivity().subscribe({
      next: (res: ActivityItem[]) => {
        // Asignamos una clase CSS al item para que el punto se pinte, 
        // dependiendo de la lógica que uses en el backend.
        this.activity = res.map(item => ({
          ...item,
          dotClass: this.getActivityDotClass(item.titulo) 
        }));
      },
      error: (err) => console.error('Error cargando actividad', err)
    });
  }

  /** Lógica para asignar la clase de estado a la celda de la tabla */
  estadoClassFrom(estado: string): string {
    const key = estado.toLowerCase();
    if (key.includes('complet')) return 'completed';
    if (key.includes('pend')) return 'pending';
    if (key.includes('env') || key.includes('shipping')) return 'shipping';
    return 'neutral';
  }

  /** Lógica de ejemplo para asignar el color del punto de actividad */
  private getActivityDotClass(titulo: string): string {
      const key = titulo.toLowerCase();
      if (key.includes('orden')) return 'green';
      if (key.includes('registro')) return 'blue';
      if (key.includes('producto')) return 'orange';
      return 'neutral';
  }
}