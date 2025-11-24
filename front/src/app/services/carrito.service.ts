import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Importante para interceptar la respuesta
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = `${environment.apiUrl}/carrito`;
  
  // Estado inicial: Leemos del localStorage para que no parpadee en 0 al recargar
  private totalItemsSubject = new BehaviorSubject<number>(this.obtenerCantidadGuardada());
  
  // Observable público: La Navbar se suscribe a esto
  totalItems$ = this.totalItemsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // --- MÉTODOS DE LECTURA ---

  // Obtener el carrito y actualizar el contador
  getCarrito(session_id: string): Observable<any> {
    const params = new HttpParams().set('session_id', session_id);
    return this.http.get<any>(`${this.apiUrl}`, { params }).pipe(
      tap((carrito) => {
        // Calculamos el total real sumando las cantidades de cada item
        const total = carrito.items.reduce((sum: number, item: any) => sum + item.cantidad, 0);
        this.actualizarCantidad(total);
      })
    );
  }

  // --- MÉTODOS DE MODIFICACIÓN (¡AQUÍ ESTABA EL PROBLEMA!) ---

  // Agregar un producto al carrito
  agregarProducto(producto_id: number, cantidad: number, session_id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, {
      producto_id,
      cantidad,
      session_id
    }).pipe(
      // 👇 ESTO FALTABA: Al agregar, pedimos el carrito nuevo para actualizar el número
      tap(() => {
        this.getCarrito(session_id).subscribe(); 
      })
    );
  }

  // Eliminar un ítem del carrito
  eliminarItem(item_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/item/${item_id}`).pipe(
      // 👇 ESTO FALTABA: Al borrar, refrescamos el contador
      tap(() => {
        this.refrescarCantidad();
      })
    );
  }

  // Vaciar carrito
  vaciarCarrito(session_id: string): Observable<any> {
    const params = new HttpParams().set('session_id', session_id);
    return this.http.delete(`${this.apiUrl}/clear`, { params }).pipe(
      // 👇 ESTO FALTABA: Al vaciar, forzamos el 0 inmediatamente
      tap(() => {
        this.actualizarCantidad(0);
      })
    );
  }

  // --- UTILIDADES ---

  // Método público para forzar actualización (útil al hacer login/logout)
  refrescarCantidad() {
    const session_id = localStorage.getItem('session_id');
    if (session_id) {
      this.getCarrito(session_id).subscribe(); // El 'tap' de getCarrito hará el trabajo
    } else {
      this.actualizarCantidad(0);
    }
  }

  // Actualiza el Subject y guarda en LocalStorage para persistencia
  public actualizarCantidad(valor: number) {
    this.totalItemsSubject.next(valor);
    localStorage.setItem('total_carrito', valor.toString());
  }

  private obtenerCantidadGuardada(): number {
    return parseInt(localStorage.getItem('total_carrito') || '0', 10);
  }
}