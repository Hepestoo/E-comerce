import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  mostrarPassword = false;

  // Variables para ngModel
  email = '';
  password = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  login() {
    // Sincronizamos los valores del HTML (ngModel) con el formulario reactivo
    this.loginForm.patchValue({ 
      email: this.email, 
      password: this.password 
    });

    if (this.loginForm.invalid) {
      this.error = 'Por favor ingresa un correo y contraseña válidos.';
      return;
    }

    this.loading = true; 
    this.error = '';

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        // 1. Guardar Token
        localStorage.setItem('token', res.access_token);
        
        // 2. Decodificar el token para saber el ROL
        try {
          // El token JWT viene como "header.PAYLOAD.signature"
          // Tomamos la parte del medio (1) y la decodificamos
          const payload = JSON.parse(atob(res.access_token.split('.')[1]));
          
          // 3. Guardar datos importantes
          localStorage.setItem('rol', payload.role);
          localStorage.setItem('usuario_id', payload.sub);

          // 4. Redirección Inteligente
          if (payload.role === 'admin') {
            this.router.navigate(['/admin']); // Si es admin, al panel
          } else {
            this.router.navigate(['/home']);  // Si es cliente, al home
          }

        } catch (e) {
          console.error('Error al leer el token', e);
          // Si algo falla al leer el rol, enviamos al home por seguridad
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Credenciales incorrectas o error de conexión';
      }
    });
  }
}