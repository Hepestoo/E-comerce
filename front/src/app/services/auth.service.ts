import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; 
import { environment } from '../../environments/environments'; 
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl; 

  constructor(
    private router: Router,
    private http: HttpClient 
  ) {}
  // Lee el token guardado y saca los datos del usuario (Nombre, ID, etc.)
  get currentUser(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      // Decodificamos el token manualmente (sin instalar librerías extra)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      
      // Truco: Si el token tiene 'username' pero el HTML pide 'nombre', lo adaptamos aquí
      return {
        ...decoded,
        nombre: decoded.nombre || decoded.username || decoded.email || 'Usuario'
      };
    } catch (e) {
      return null;
    }
  }

  // --- LOGIN (Con tap para guardar datos automáticamente) ---
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials).pipe(
      tap((res: any) => {
        // Guardamos token y rol automáticamente al loguearse
        if (res.access_token) localStorage.setItem('token', res.access_token);
        if (res.role) localStorage.setItem('rol', res.role);
        if (res.user?.nombre) localStorage.setItem('nombre_usuario', res.user.nombre);
      })
    );
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
    localStorage.removeItem('nombre_usuario'); // Limpiamos todo
    this.router.navigate(['/login']);
  }

  // --- RECUPERAR CONTRASEÑA ---
  solicitarRecuperacion(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/request-password-reset`, { email });
  }

  // --- RESETEAR CONTRASEÑA ---
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