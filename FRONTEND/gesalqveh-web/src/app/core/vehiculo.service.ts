import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Vehiculo, VehiculoFilter } from './models';

@Injectable({ providedIn: 'root' })
export class VehiculoService {
  private http = inject(HttpClient);
  private buscador = `${environment.apiBase}/buscador/vehiculos`;
  private dashboard = `${environment.apiBase}/dashboard/vehiculos`;

  buscar(filter: VehiculoFilter): Observable<Vehiculo[]> {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(filter)) {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    }
    return this.http.get<Vehiculo[]>(`${this.buscador}/buscar`, { params });
  }

  obtener(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.buscador}/${id}`);
  }

  // CRUD (protegido)
  listar(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.dashboard);
  }

  crear(v: Vehiculo): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(this.dashboard, v);
  }

  actualizar(id: number, v: Vehiculo): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(`${this.dashboard}/${id}`, v);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.dashboard}/${id}`);
  }
}
