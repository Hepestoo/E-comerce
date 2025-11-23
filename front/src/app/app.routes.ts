import { Routes } from '@angular/router';
import { adminAuthGuard } from './pages/admin/guards/admin-auth.guard';
import { ClienteLayoutComponent } from './pages/cliente/cliente-layout.component';

// IMPORTAR TU NUEVO LAYOUT DE ADMIN
// (Asegúrate de que la ruta coincida con donde guardaste el archivo)
import { AdminLayoutComponent } from './pages/admin/admin-layout.component';

export const routes: Routes = [
  // --- RUTAS PÚBLICAS / REDIRECCIONES ---
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Auth Cliente
  {
    path: 'login',
    loadComponent: () => import('./pages/cliente/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/cliente/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'recuperar-password',
    loadComponent: () => import('./pages/cliente/request-reset/request-reset.component').then(m => m.RequestResetComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/cliente/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },

  // --- RUTAS CLIENTE (Con Navbar y Footer) ---
  {
    path: '',
    component: ClienteLayoutComponent,
    children: [
      { path: 'home', loadComponent: () => import('./pages/cliente/home/home.component').then(m => m.HomeComponent) },
      { path: 'catalogo', loadComponent: () => import('./pages/cliente/catalogo/catalogo.component').then(m => m.CatalogoComponent) },
      { path: 'contacto', loadComponent: () => import('./pages/cliente/contacto/contacto.component').then(m => m.ContactoComponent) },
      { path: 'nosotros', loadComponent: () => import('./pages/cliente/nosotros/nosotros.component').then(m => m.NosotrosComponent) },
      { path: 'carrito', loadComponent: () => import('./pages/cliente/carrito/carrito.component').then(m => m.CarritoComponent) },
    ]
  },

  // --- RUTAS ADMIN (CON EL NUEVO LAYOUT) ---
  {
    path: 'admin',
    component: AdminLayoutComponent, // <--- AQUI ESTÁ LA CLAVE: Usamos el Layout como padre
    canActivate: [adminAuthGuard],   // Protegemos todo el bloque con el guardián
    children: [
      // Dashboard (Ruta raíz de admin)
      {
        path: '', 
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      // Gestión de Productos
      {
        path: 'productos', 
        loadComponent: () => import('./pages/admin/productos/productos.component').then(m => m.ProductosComponent),
      },
      // Gestión de Categorías
      {
        path: 'subcategorias',
        loadComponent: () => import('./pages/admin/subcategorias/subcategorias.component').then(m => m.SubcategoriasComponent),
      },
      // Gestión de Órdenes
      {
        path: 'ordenes',
        loadComponent: () => import('./pages/admin/ordenes/ordenes.component').then(m => m.OrdenesComponent),
      },
      // Gestión de Pagos
      {
        path: 'pagos',
        loadComponent: () => import('./pages/admin/pagos/pagos.component').then(m => m.PagosComponent),
      }
    ]
  },

  // Ruta 404 (Cualquier otra cosa redirige al home)
  { path: '**', redirectTo: 'home' }
];