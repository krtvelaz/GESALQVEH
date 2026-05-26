import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule,
  ],
  template: `
    <div class="wrap">
      <mat-card class="card">
        <mat-card-header>
          <mat-card-title>Acceso administrador</mat-card-title>
          <mat-card-subtitle>Introduce tus credenciales para acceder al panel.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()" class="form">
            <mat-form-field appearance="outline">
              <mat-label>Usuario</mat-label>
              <input matInput formControlName="username" autocomplete="username">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" formControlName="password" autocomplete="current-password">
            </mat-form-field>
            @if (error()) {
              <p class="error">{{ error() }}</p>
            }
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
              <mat-icon>login</mat-icon>
              Entrar
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .wrap { display: flex; justify-content: center; padding: 48px 16px; }
    .card { width: 100%; max-width: 420px; padding: 16px; }
    .form { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
    .error { color: #c62828; margin: 0; }
  `,
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    username: ['admin', Validators.required],
    password: ['admin', Validators.required],
  });

  submit(): void {
    this.loading.set(true);
    this.error.set(null);
    const { username, password } = this.form.getRawValue();
    this.auth.login(username, password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        this.error.set(err?.error?.error ?? 'Credenciales inválidas');
        this.loading.set(false);
      },
    });
  }
}
