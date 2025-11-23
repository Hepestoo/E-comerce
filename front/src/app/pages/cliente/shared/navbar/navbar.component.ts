import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../../../services/carrito.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  totalCarrito: number = 0;
  menuAbierto = false; // Controla el dropdown del usuario

  constructor(
    private carritoService: CarritoService,
    public auth: AuthService,
    private eRef: ElementRef // Para detectar clicks fuera
  ) {}

  ngOnInit(): void {
    this.carritoService.totalItems$.subscribe((total) => {
      this.totalCarrito = total;
    });
    this.carritoService.refrescarCantidad();
  }

  // Alternar menú
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  // Cerrar menú (se usa desde el HTML o HostListener)
  closeMenu() {
    this.menuAbierto = false;
  }

  logout() {
    this.menuAbierto = false; // Cerrar menú antes de salir
    this.auth.logout();
  }

  // Detectar clic fuera para cerrar el menú
  @HostListener('document:click', ['$event'])
  clickOut(event: any) {
    // Si el clic NO fue dentro del componente navbar, cerramos el menú
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.menuAbierto = false;
    }
  }
}