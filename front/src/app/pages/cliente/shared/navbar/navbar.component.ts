import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../../../services/carrito.service'; // Ajusta la ruta si es necesario
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  menuAbierto = false; // Controla el dropdown del usuario mobile

  constructor(
    // ✅ Hacemos el servicio 'public' para usarlo directo en el HTML (Pipe Async)
    public carritoService: CarritoService, 
    public auth: AuthService,
    private eRef: ElementRef 
  ) {}

  ngOnInit(): void {
    // Al iniciar, pedimos refrescar el número por si acaso
    this.carritoService.refrescarCantidad();
  }

  // Alternar menú hamburguesa / usuario
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  closeMenu() {
    this.menuAbierto = false;
  }

  logout() {
    this.menuAbierto = false; 
    this.auth.logout();
    // Opcional: Resetear contador visualmente al salir
    this.carritoService.actualizarCantidad(0);
  }

  // Detectar clic fuera para cerrar el menú
  @HostListener('document:click', ['$event'])
  clickOut(event: any) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.menuAbierto = false;
    }
  }
}