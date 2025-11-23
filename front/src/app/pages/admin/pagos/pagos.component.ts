import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagosService, Pago } from '../../../services/pagos.service';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'] 
})
export class PagosComponent implements OnInit {
  pagos: Pago[] = [];
  pagosFiltrados: Pago[] = []; // Para el buscador

  constructor(private pagosService: PagosService) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos() {
    this.pagosService.listar().subscribe((res) => {
      this.pagos = res;
      this.pagosFiltrados = res; // Inicialmente mostramos todos
    });
  }

  filtrar(event: any) {
    const texto = event.target.value.toLowerCase();
    this.pagosFiltrados = this.pagos.filter(p => 
      p.id.toString().includes(texto) || 
      p.monto.toString().includes(texto) ||
      p.metodo?.nombre.toLowerCase().includes(texto)
    );
  }

  calcularTotalRecaudado(): number {
    return this.pagos.reduce((total, pago) => total + Number(pago.monto), 0);
  }

  // Helper para iconos
  getIconoMetodo(nombre: string | undefined): string {
    if (!nombre) return 'pi-money-bill';
    const n = nombre.toLowerCase();
    if (n.includes('tarjeta')) return 'pi-credit-card';
    if (n.includes('transferencia')) return 'pi-building';
    if (n.includes('paypal')) return 'pi-paypal';
    return 'pi-money-bill'; // Default (Efectivo)
  }
}