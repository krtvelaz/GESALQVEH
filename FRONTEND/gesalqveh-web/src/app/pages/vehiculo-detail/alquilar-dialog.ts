import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlquilerService } from '../../core/alquiler.service';
import { ClientSessionService } from '../../core/client-session.service';
import { Vehiculo } from '../../core/models';

type Step = 'confirm' | 'capture' | 'fechas';

@Component({
  selector: 'app-alquilar-dialog',
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatButtonModule, MatIconModule,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <h2 mat-dialog-title>Alquilar {{ data.vehiculo.marca }} {{ data.vehiculo.modelo }}</h2>
    <mat-dialog-content>
      @if (step() === 'confirm') {
        <div class="confirm">
          <p>¿Eres <strong>{{ sessionCliente()!.nombre }}</strong> (DNI {{ sessionCliente()!.dni }})?</p>
          <div class="confirm-actions">
            <button mat-stroked-button (click)="elijoOtro()">
              <mat-icon>person_off</mat-icon>
              No, soy otra persona
            </button>
            <button mat-flat-button color="primary" (click)="confirmoYo()">
              <mat-icon>person</mat-icon>
              Sí, soy yo
            </button>
          </div>
        </div>
      } @else if (step() === 'capture') {
        <form [formGroup]="clienteForm" class="form">
          <mat-form-field appearance="outline">
            <mat-label>Nombre completo</mat-label>
            <input matInput formControlName="nombre" autocomplete="name">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>DNI</mat-label>
            <input matInput formControlName="dni" autocomplete="off">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Teléfono</mat-label>
            <input matInput formControlName="telefono" autocomplete="tel">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email">
          </mat-form-field>
        </form>
      } @else {
        <form [formGroup]="fechasForm" class="form">
          <p class="muted">Cliente: <strong>{{ snapshot()?.nombre }}</strong> ({{ snapshot()?.dni }})</p>
          <mat-form-field appearance="outline">
            <mat-label>Fecha inicio</mat-label>
            <input matInput [matDatepicker]="dpIni" formControlName="fechaInicio">
            <mat-datepicker-toggle matIconSuffix [for]="dpIni"></mat-datepicker-toggle>
            <mat-datepicker #dpIni></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Fecha fin</mat-label>
            <input matInput [matDatepicker]="dpFin" formControlName="fechaFin">
            <mat-datepicker-toggle matIconSuffix [for]="dpFin"></mat-datepicker-toggle>
            <mat-datepicker #dpFin></mat-datepicker>
          </mat-form-field>
        </form>
      }
      @if (errorMsg()) {
        <p class="error">{{ errorMsg() }}</p>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      @if (step() === 'capture') {
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" [disabled]="clienteForm.invalid" (click)="continuarDesdeCaptura()">
          Continuar
        </button>
      } @else if (step() === 'fechas') {
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" [disabled]="fechasForm.invalid || submitting()" (click)="submit()">
          <mat-icon>check</mat-icon>
          Confirmar alquiler
        </button>
      } @else {
        <button mat-button mat-dialog-close>Cancelar</button>
      }
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 12px; min-width: 360px; }
    .confirm { min-width: 360px; padding: 8px 0 16px; }
    .confirm p { margin: 0 0 16px; font-size: 1.05rem; }
    .confirm-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .muted { color: #666; margin: 0 0 8px; }
    .error { color: #c62828; margin: 8px 0 0; }
  `,
})
export class AlquilarDialog {
  private fb = inject(FormBuilder);
  private alquilerService = inject(AlquilerService);
  private session = inject(ClientSessionService);
  private ref = inject(MatDialogRef<AlquilarDialog>);
  data = inject<{ vehiculo: Vehiculo }>(MAT_DIALOG_DATA);

  sessionCliente = computed(() => this.session.cliente());
  step = signal<Step>(this.initialStep());
  snapshot = signal(this.session.cliente());
  submitting = signal(false);
  errorMsg = signal<string | null>(null);

  clienteForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    dni: ['', Validators.required],
    telefono: [''],
    email: ['', Validators.email],
  });

  fechasForm = this.fb.group({
    fechaInicio: [new Date(), Validators.required],
    fechaFin: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), Validators.required],
  });

  private initialStep(): Step {
    return this.session.cliente() ? 'confirm' : 'capture';
  }

  confirmoYo(): void {
    this.session.confirm();
    this.snapshot.set(this.session.cliente());
    this.step.set('fechas');
  }

  elijoOtro(): void {
    this.session.clear();
    this.snapshot.set(null);
    this.step.set('capture');
  }

  continuarDesdeCaptura(): void {
    const v = this.clienteForm.getRawValue();
    this.session.save({
      nombre: v.nombre,
      dni: v.dni,
      telefono: v.telefono || undefined,
      email: v.email || undefined,
      confirmado: true,
    });
    this.snapshot.set(this.session.cliente());
    this.step.set('fechas');
  }

  submit(): void {
    const cliente = this.snapshot();
    const f = this.fechasForm.value;
    if (!cliente || !f.fechaInicio || !f.fechaFin || !this.data.vehiculo.id) return;
    this.submitting.set(true);
    this.errorMsg.set(null);
    this.alquilerService.alquilar({
      vehiculoId: this.data.vehiculo.id,
      clienteNombre: cliente.nombre,
      clienteDni: cliente.dni,
      clienteTelefono: cliente.telefono,
      clienteEmail: cliente.email,
      fechaInicio: this.iso(f.fechaInicio),
      fechaFin: this.iso(f.fechaFin),
    }).subscribe({
      next: () => this.ref.close('ok'),
      error: err => {
        this.errorMsg.set(err?.error?.message ?? 'Error al crear el alquiler');
        this.submitting.set(false);
      },
    });
  }

  private iso(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
