import { Injectable, signal } from '@angular/core';

const KEY = 'gesalqveh_cliente';

export interface ClienteSesion {
  nombre: string;
  dni: string;
  telefono?: string;
  email?: string;
  confirmado: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClientSessionService {
  private readonly _cliente = signal<ClienteSesion | null>(this.read());
  readonly cliente = this._cliente.asReadonly();

  save(c: ClienteSesion): void {
    sessionStorage.setItem(KEY, JSON.stringify(c));
    this._cliente.set(c);
  }

  confirm(): void {
    const c = this._cliente();
    if (!c) return;
    this.save({ ...c, confirmado: true });
  }

  clear(): void {
    sessionStorage.removeItem(KEY);
    this._cliente.set(null);
  }

  private read(): ClienteSesion | null {
    try {
      const raw = sessionStorage.getItem(KEY);
      return raw ? JSON.parse(raw) as ClienteSesion : null;
    } catch {
      return null;
    }
  }
}
