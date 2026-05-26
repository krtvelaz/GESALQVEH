import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/dashboard/auth`;

  readonly authenticated = signal<boolean>(false);

  login(username: string, password: string): Observable<{ username: string }> {
    return this.http.post<{ username: string }>(`${this.base}/login`, { username, password }).pipe(
      tap(() => this.authenticated.set(true)),
    );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.base}/logout`, {}).pipe(
      tap(() => this.authenticated.set(false)),
    );
  }

  check(): Observable<boolean> {
    return this.http.get(`${this.base}/me`).pipe(
      map(() => {
        this.authenticated.set(true);
        return true;
      }),
      catchError(() => {
        this.authenticated.set(false);
        return of(false);
      }),
    );
  }
}
