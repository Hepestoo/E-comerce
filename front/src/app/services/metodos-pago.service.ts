import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetodosPagoService {
  private apiUrl = `${environment.apiUrl}/metodos-pago`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  listar(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(this.apiUrl);
  }

  crear(metodo: Partial<MetodoPago>): Observable<MetodoPago> {
    return this.http.post<MetodoPago>(this.apiUrl, metodo, {
      headers: this.getHeaders()
    });
  }

  actualizar(id: number, metodo: Partial<MetodoPago>): Observable<MetodoPago> {
    return this.http.patch<MetodoPago>(`${this.apiUrl}/${id}`, metodo, {
      headers: this.getHeaders()
    });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}