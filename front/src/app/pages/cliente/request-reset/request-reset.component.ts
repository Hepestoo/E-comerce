import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-request-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.scss']
})
export class RequestResetComponent {
  email = '';
  loading = false;
  mensaje = '';
  error = '';

  constructor(private auth: AuthService) {}

  enviar() {
    this.loading = true;
    this.mensaje = '';
    this.error = '';

    this.auth.solicitarRecuperacion(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.mensaje = '¡Correo enviado! Revisa tu bandeja de entrada.';
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudo enviar el correo. Verifica el email.';
      }
    });
  }
}