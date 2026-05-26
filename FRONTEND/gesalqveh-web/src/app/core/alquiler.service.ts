import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Alquiler } from './models';

export interface AlquilerRequest {
  vehiculoId: number;
  clienteNombre: string;
  clienteDni: string;
  clienteTelefono?: string;
  clienteEmail?: string;
  fechaInicio: string;
  fechaFin: string;
}

@Injectable({ providedIn: 'root' })
export class AlquilerService {
  private http = inject(HttpClient);
  private buscador = `${environment.apiBase}/buscador/alquileres`;
  private operador = `${environment.apiBase}/operador/alquileres`;

  listar(): Observable<Alquiler[]> {
    return this.http.get<Alquiler[]>(this.buscador);
  }

  listarPorDni(dni: string): Observable<Alquiler[]> {
    const params = new HttpParams().set('clienteDni', dni);
    return this.http.get<Alquiler[]>(`${this.buscador}/buscar`, { params });
  }

  listarActivos(): Observable<Alquiler[]> {
    const params = new HttpParams().set('estado', 'ACTIVO');
    return this.http.get<Alquiler[]>(`${this.buscador}/buscar`, { params });
  }

  obtener(id: number): Observable<Alquiler> {
    return this.http.get<Alquiler>(`${this.buscador}/${id}`);
  }

  alquilar(req: AlquilerRequest): Observable<Alquiler> {
    return this.http.post<Alquiler>(this.operador, req);
  }

  devolver(id: number, fechaDevolucionReal: string): Observable<Alquiler> {
    return this.http.post<Alquiler>(`${this.operador}/${id}/devolver`, { fechaDevolucionReal });
  }

  extender(id: number, nuevaFechaFin: string): Observable<Alquiler> {
    return this.http.put<Alquiler>(`${this.operador}/${id}/extender`, { nuevaFechaFin });
  }
}
