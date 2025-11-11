import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
// --- IMPORTACIÓN AÑADIDA ---
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // --- NUEVO: Bandera para cambiar de formulario ---
  isRegistering = false;

  // --- Modelo de datos unificado para ambos formularios ---
  nombre = '';
  apellido = '';
  email = '';
  password = '';
  error = '';

  // --- LÍNEA AÑADIDA: URL base de la API ---
  private apiUrl = environment.apiUrl;

  // --- Sin cambios ---
  mostrarPassword: boolean = false;
  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  constructor(private http: HttpClient, private router: Router) {}

  // --- Función LOGIN (sin cambios) ---
  login() {
    this.error = '';
    // --- LÍNEA MODIFICADA: Se usa la variable apiUrl ---
    this.http.post<{ access_token: string }>(`${this.apiUrl}/users/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        const payload = JSON.parse(atob(res.access_token.split('.')[1]));
        localStorage.setItem('rol', payload.role);
        
        // CORRECCIÓN: El payload que generaste en el backend es { sub: user.id, ... }
        // Deberías usar 'sub' en lugar de 'id'
        localStorage.setItem('usuario_id', payload.sub); 

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        });

        if (payload.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
        Swal.fire('Error', 'Credenciales incorrectas', 'error');
      }
    });
  }

  // --- NUEVA: Función de Registro ---
  register() {
    this.error = '';
    
    // Construimos el DTO que espera el backend
    const userDto = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      password: this.password
      // El 'rol' no lo enviamos, el backend asigna 'cliente' por defecto
    };

    // --- LÍNEA MODIFICADA: Se usa la variable apiUrl ---
    this.http.post(`${this.apiUrl}/users/register`, userDto)
      .subscribe({
        next: (res) => {
          // Si el registro es exitoso...
          Swal.fire({
            icon: 'success',
            title: '¡Registro Exitoso!',
            text: 'Tu cuenta ha sido creada. Ahora, por favor inicia sesión.',
          });
          
          // Cambiamos al formulario de login
          this.isRegistering = false;
          // Dejamos el email y password para que el usuario solo dé clic en "Ingresar"
        },
        error: (err) => {
          // Capturamos el error del backend (ej. email duplicado)
          this.error = Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message;
          Swal.fire('Error', this.error || 'No se pudo completar el registro', 'error');
        }
      });
  }

  // --- NUEVO: Función para limpiar el formulario al cambiar ---
  toggleForm(view: 'login' | 'register') {
    this.isRegistering = (view === 'register');
    this.error = '';
    this.nombre = '';
    this.apellido = '';
    this.email = '';
    this.password = '';
  }
}