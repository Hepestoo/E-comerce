import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments'; // Ruta corregida

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url?: string;
  destacado?: boolean;
  subcategoria: {
    id: number;
    nombre: string;
    // Opcional: si el backend devuelve la categoría padre dentro de la subcategoría
    categoria?: {
      id: number;
      nombre: string;
    }
  };
}

// DTO para crear/editar productos
export interface ProductoDTO {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  subcategoria_id: number;
  imagen_url?: string;
  destacado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // Base URL general (ej: http://localhost:3000)
  private apiUrl = environment.apiUrl;
  // URL específica de productos
  private apiProductos = `${this.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // --- CRUD DE PRODUCTOS ---

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiProductos);
  }

  crear(producto: ProductoDTO): Observable<Producto> {
    return this.http.post<Producto>(this.apiProductos, producto, {
      headers: this.getAuthHeaders()
    });
  }

  actualizar(id: number, producto: ProductoDTO): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiProductos}/${id}`, producto, {
      headers: this.getAuthHeaders()
    });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiProductos}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  
  obtenerPorSubcategoria(subcategoriaId: number) {
    return this.http.get<any[]>(`${this.apiProductos}/subcategoria/${subcategoriaId}`);
  }
  
  obtenerCategoriasPadre() {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`);
  }

  obtenerSubcategorias() {
    return this.http.get<any[]>(`${this.apiUrl}/subcategorias`);
  }
  
}