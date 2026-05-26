import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClienteService } from '../../core/cliente.service';
import { Cliente } from '../../core/models';

@Component({
  selector: 'app-cliente-form-dialog',
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Nuevo' }} cliente</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>DNI</mat-label>
          <input matInput formControlName="dni">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
        </mat-form-field>
        @if (error()) { <p class="error">{{ error() }}</p> }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid || saving()" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 8px; min-width: 360px; padding-top: 8px; }
    .error { color: #c62828; margin: 8px 0 0; }
  `,
})
export class ClienteFormDialog {
  private fb = inject(FormBuilder);
  private service = inject(ClienteService);
  private ref = inject(MatDialogRef<ClienteFormDialog>);
  data = inject<Cliente | null>(MAT_DIALOG_DATA);

  saving = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    nombre: [this.data?.nombre ?? '', Validators.required],
    dni: [this.data?.dni ?? '', Validators.required],
    telefono: [this.data?.telefono ?? ''],
    email: [this.data?.email ?? '', Validators.email],
  });

  save(): void {
    this.saving.set(true);
    this.error.set(null);
    const c = this.form.getRawValue() as unknown as Cliente;
    const op = this.data?.id ? this.service.actualizar(this.data.id, c) : this.service.crear(c);
    op.subscribe({
      next: () => this.ref.close('ok'),
      error: err => {
        this.error.set(err?.error?.message ?? 'Error al guardar');
        this.saving.set(false);
      },
    });
  }
}
