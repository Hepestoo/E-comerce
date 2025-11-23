import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats`);
  }

  getLatestOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dashboard/orders`);
  }

  getActivity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dashboard/activity`);
  }
}
