import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlquilerView, ResumenDashboard, Vehiculo } from './models';

export type TipoLista = 'alquilados' | 'proximos' | 'vencidos' | 'disponibles';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/dashboard/dashboard`;

  resumen(): Observable<ResumenDashboard> {
    return this.http.get<ResumenDashboard>(`${this.base}/resumen`);
  }

  alquileres(tipo: Exclude<TipoLista, 'disponibles'>): Observable<AlquilerView[]> {
    return this.http.get<AlquilerView[]>(`${this.base}/listas/${tipo}`);
  }

  disponibles(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.base}/listas/disponibles`);
  }
}
