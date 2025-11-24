import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  crear(categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria, {
      headers: this.getAuthHeaders()
    });
  }

  actualizar(id: number, categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.apiUrl}/${id}`, categoria, { // Ojo: NestJS suele usar PATCH, si falla usa PUT
      headers: this.getAuthHeaders()
    });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}