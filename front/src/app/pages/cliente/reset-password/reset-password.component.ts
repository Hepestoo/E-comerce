import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  password = '';
  token = '';
  loading = false;
  mensaje = '';
  error = '';

  // Variables para las validaciones visuales
  hasMinLength = false;
  hasUpperCase = false;
  hasSpecialChar = false;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.error = 'Enlace inválido. Falta el token.';
      }
    });
  }

  // Función que analiza la contraseña en tiempo real
  onPasswordChange() {
    const pwd = this.password || '';
    
    // 1. Mínimo 6 caracteres
    this.hasMinLength = pwd.length >= 6;
    
    // 2. Al menos una mayúscula (A-Z)
    this.hasUpperCase = /[A-Z]/.test(pwd);
    
    // 3. Al menos un carácter especial o número
    this.hasSpecialChar = /[0-9!@#$%^&*(),.?":{}|<>]/.test(pwd);
  }

  // Getter para saber si el formulario es válido
  get isPasswordValid(): boolean {
    return this.hasMinLength && this.hasUpperCase && this.hasSpecialChar;
  }

  cambiar() {
    if (!this.token || !this.isPasswordValid) return;
    this.loading = true;
    
    this.auth.restablecerContraseña(this.token, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.mensaje = '¡Contraseña actualizada! Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.loading = false;
        this.error = 'El enlace ha expirado o es inválido.';
      }
    });
  }
}