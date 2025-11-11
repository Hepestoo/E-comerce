import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

// --- PASO 1: Importa el environment ---
import { environment } from "../../environments/environments";

export interface Pago {
  id: number;
  orden_id: number;
  metodo_pago_id: number;
  monto: number;
  estado: string;
  fecha_pago: string;
  metodo?: {
    nombre: string;
  };
}

@Injectable({ providedIn: 'root' })
export class PagosService {
  
  // --- PASO 2: Construye la URL de la API dinámicamente ---
  private api = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.api);
  }

  listarMetodosPago(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/metodos`);
  }
  
  crearPago(data: any) {
    // --- PASO 3: Asegúrate de que TODAS las llamadas usen la variable 'api' ---
    return this.http.post(this.api, data);
  }
  
}