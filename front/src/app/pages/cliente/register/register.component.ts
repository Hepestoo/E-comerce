import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.error = '';

    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        // Alerta bonita de éxito
        Swal.fire({
          title: '¡Bienvenido!',
          text: 'Tu cuenta en Artemania ha sido creada con éxito ✨',
          icon: 'success',
          confirmButtonText: 'Iniciar Sesión',
          confirmButtonColor: '#7951a8',
          background: '#fff',
          customClass: {
            popup: 'rounded-alert',
            confirmButton: 'rounded-btn-alert'
          },
          buttonsStyling: false
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message || 'Error al registrarse. Intenta de nuevo.';
        
        // Alerta bonita de error
        Swal.fire({
          title: '¡Ups!',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#d33',
          background: '#fff',
          customClass: {
            popup: 'rounded-alert',
            confirmButton: 'rounded-btn-alert-error'
          },
          buttonsStyling: false
        });
      }
    });
  }
}