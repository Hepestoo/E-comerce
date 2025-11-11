import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

// --- PASO 1: Importa el environment ---
// La ruta es ../../ porque estamos en src/app/services/
import { environment } from "../../environments/environments";

export interface Subcategoria {
  id: number;
  nombre: string;
  categoria_id: number;
  categoria?: {
    id: number;
    nombre: string;
  };
}

@Injectable({ providedIn: 'root' })
export class SubcategoriaService {
  
  // --- PASO 2: Construye la URL de la API dinámicamente ---
  private api = `${environment.apiUrl}/subcategorias`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(this.api);
  }

  crear(data: Partial<Subcategoria>) {
    return this.http.post(this.api, data, {
      headers: this.getAuthHeaders()
    });
  }

  actualizar(id: number, data: Partial<Subcategoria>) {
    return this.http.patch(`${this.api}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  eliminar(id: number) {
    return this.http.delete(`${this.api}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}