import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  nombre = '';
  apellido = '';
  email = '';
  password = '';
  error = '';
  mostrarPassword = false;

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // <-- aclaramos el tipo de retorno
  register(): void {
    // VALIDACIONES (cliente)
    if (!this.nombre || this.nombre.length < 2) {
      Swal.fire('Error', 'Nombre inválido', 'error');
      return;
    }

    if (!this.apellido || this.apellido.length < 2) {
      Swal.fire('Error', 'Apellido inválido', 'error');
      return;
    }

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(this.email)) {
      Swal.fire('Error', 'Correo inválido', 'error');
      return;
    }

    if (!this.password || this.password.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener mínimo 6 caracteres', 'error');
      return;
    }

    // DTO UNA SOLA VEZ
    const userDto = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      password: this.password
    };

    // PETICIÓN UNA SOLA VEZ
    this.http.post(`${this.apiUrl}/users/register`, userDto).subscribe({
      next: () => {
        Swal.fire('¡Registro Exitoso!', 'Ahora inicia sesión.', 'success');

        this.router.navigate(['/login'], {
          queryParams: { email: this.email }
        });
      },
      error: (err) => {
        this.error =
          Array.isArray(err?.error?.message)
            ? err.error.message.join(', ')
            : err?.error?.message || 'No se pudo completar el registro';

        Swal.fire('Error', this.error, 'error');
      }
    });
  }
}
