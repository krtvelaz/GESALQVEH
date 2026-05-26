import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente } from './models';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private buscador = `${environment.apiBase}/buscador/clientes`;
  private dashboard = `${environment.apiBase}/dashboard/clientes`;

  listarPublico(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.buscador);
  }

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.dashboard);
  }

  crear(c: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.dashboard, c);
  }

  actualizar(id: number, c: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.dashboard}/${id}`, c);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.dashboard}/${id}`);
  }
}
