import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // <--- Faltaba esto
import { environment } from '../../environments/environments'; // <--- Faltaba esto
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Usamos la URL definida en tu environment (localhost o render)
  private apiUrl = environment.apiUrl; 

  constructor(
    private router: Router,
    private http: HttpClient // <--- Inyectamos el cliente HTTP
  ) {}

  // --- LOGIN ---
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials);
  }

  // --- REGISTRO ---
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData);
  }

  // --- LOGOUT ---
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('session_id');
    this.router.navigate(['/login']);
  }

  // --- RECUPERAR CONTRASEÑA (Paso 1: Enviar correo) ---
  // Esta es la función que te daba error por no existir
  solicitarRecuperacion(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/request-password-reset`, { email });
  }

  // --- RESETEAR CONTRASEÑA (Paso 2: Guardar nueva clave) ---
  // Esta también te faltaba
  restablecerContraseña(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { token, password: newPassword });
  }

  // --- UTILIDADES ---
  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  isAdmin(): boolean {
    return this.getRol() === 'admin';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}