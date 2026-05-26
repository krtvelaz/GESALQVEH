import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlquilerService } from '../../core/alquiler.service';
import { Alquiler } from '../../core/models';

interface DialogData {
  modo: 'devolver' | 'extender';
  alquiler: Alquiler;
}

@Component({
  selector: 'app-action-dialog',
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatButtonModule, MatIconModule,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <h2 mat-dialog-title>
      {{ data.modo === 'devolver' ? 'Devolver vehículo' : 'Extender alquiler' }}
    </h2>
    <mat-dialog-content>
      <p>
        <strong>{{ data.alquiler.vehiculo.marca }} {{ data.alquiler.vehiculo.modelo }}</strong>
        — Cliente: {{ data.alquiler.cliente.nombre }}
      </p>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>{{ data.modo === 'devolver' ? 'Fecha de devolución real' : 'Nueva fecha fin' }}</mat-label>
          <input matInput [matDatepicker]="dp" formControlName="fecha">
          <mat-datepicker-toggle matIconSuffix [for]="dp"></mat-datepicker-toggle>
          <mat-datepicker #dp></mat-datepicker>
        </mat-form-field>

        @if (errorMsg()) {
          <p class="error">{{ errorMsg() }}</p>
        }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid || submitting()" (click)="submit()">
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 12px; min-width: 320px; }
    .error { color: #c62828; margin: 0; }
  `,
})
export class ActionDialog {
  private fb = inject(FormBuilder);
  private service = inject(AlquilerService);
  private ref = inject(MatDialogRef<ActionDialog>);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  submitting = signal<boolean>(false);
  errorMsg = signal<string | null>(null);

  form = this.fb.group({
    fecha: [new Date(), Validators.required],
  });

  submit(): void {
    const fecha = this.form.value.fecha;
    if (!fecha) return;
    const iso = fecha.toISOString().slice(0, 10);
    this.submitting.set(true);
    this.errorMsg.set(null);

    const op = this.data.modo === 'devolver'
      ? this.service.devolver(this.data.alquiler.id, iso)
      : this.service.extender(this.data.alquiler.id, iso);

    op.subscribe({
      next: () => this.ref.close('ok'),
      error: err => {
        this.errorMsg.set(err?.error?.message ?? 'Operación fallida');
        this.submitting.set(false);
      },
    });
  }
}
