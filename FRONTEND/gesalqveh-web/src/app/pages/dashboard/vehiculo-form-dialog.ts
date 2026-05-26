import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { VehiculoService } from '../../core/vehiculo.service';
import { Vehiculo } from '../../core/models';

@Component({
  selector: 'app-vehiculo-form-dialog',
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatCheckboxModule, MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Nuevo' }} vehículo</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <div class="grid">
          <mat-form-field appearance="outline">
            <mat-label>Matrícula</mat-label>
            <input matInput formControlName="matricula">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Año</mat-label>
            <input matInput type="number" formControlName="anio">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Marca</mat-label>
            <input matInput formControlName="marca">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Modelo</mat-label>
            <input matInput formControlName="modelo">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Tipo</mat-label>
            <mat-select formControlName="tipo">
              @for (t of tipos; track t) { <mat-option [value]="t">{{ t }}</mat-option> }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Precio diario (€)</mat-label>
            <input matInput type="number" step="0.01" formControlName="precioDiario">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Color</mat-label>
            <input matInput formControlName="color">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Plazas</mat-label>
            <input matInput type="number" formControlName="plazas">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Kilometraje</mat-label>
            <input matInput type="number" formControlName="kilometraje">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Transmisión</mat-label>
            <mat-select formControlName="transmision">
              <mat-option [value]="null">—</mat-option>
              @for (t of transmisiones; track t) { <mat-option [value]="t">{{ t }}</mat-option> }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Combustible</mat-label>
            <mat-select formControlName="combustible">
              <mat-option [value]="null">—</mat-option>
              @for (c of combustibles; track c) { <mat-option [value]="c">{{ c }}</mat-option> }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Categoría</mat-label>
            <mat-select formControlName="categoria">
              <mat-option [value]="null">—</mat-option>
              @for (c of categorias; track c) { <mat-option [value]="c">{{ c }}</mat-option> }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Sucursal</mat-label>
            <input matInput formControlName="sucursal">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Descripción</mat-label>
            <input matInput formControlName="descripcion">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>URL imagen</mat-label>
            <input matInput formControlName="urlImagen">
          </mat-form-field>
        </div>
        <mat-checkbox formControlName="disponible">Disponible para alquilar</mat-checkbox>
        @if (error()) { <p class="error">{{ error() }}</p> }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid || saving()" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { padding-top: 8px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; }
    .full { grid-column: 1 / -1; }
    .error { color: #c62828; margin: 8px 0 0; }
  `,
})
export class VehiculoFormDialog {
  private fb = inject(FormBuilder);
  private service = inject(VehiculoService);
  private ref = inject(MatDialogRef<VehiculoFormDialog>);
  data = inject<Vehiculo | null>(MAT_DIALOG_DATA);

  saving = signal(false);
  error = signal<string | null>(null);

  tipos = ['COCHE', 'MOTO', 'CAMION', 'SUV', 'FURGONETA'];
  transmisiones = ['MANUAL', 'AUTOMATICA'];
  combustibles = ['GASOLINA', 'DIESEL', 'ELECTRICO', 'HIBRIDO'];
  categorias = ['ECONOMICO', 'PREMIUM', 'LUJO'];

  form = this.fb.group({
    matricula: [this.data?.matricula ?? '', Validators.required],
    marca: [this.data?.marca ?? '', Validators.required],
    modelo: [this.data?.modelo ?? '', Validators.required],
    anio: [this.data?.anio ?? new Date().getFullYear(), Validators.required],
    tipo: [this.data?.tipo ?? 'COCHE', Validators.required],
    color: [this.data?.color ?? ''],
    precioDiario: [this.data?.precioDiario ?? 0, [Validators.required, Validators.min(0.01)]],
    disponible: [this.data?.disponible ?? true],
    transmision: [this.data?.transmision ?? null],
    combustible: [this.data?.combustible ?? null],
    plazas: [this.data?.plazas ?? null],
    kilometraje: [this.data?.kilometraje ?? null],
    categoria: [this.data?.categoria ?? null],
    sucursal: [this.data?.sucursal ?? ''],
    descripcion: [this.data?.descripcion ?? ''],
    urlImagen: [this.data?.urlImagen ?? ''],
  });

  save(): void {
    this.saving.set(true);
    this.error.set(null);
    const v = this.form.getRawValue() as unknown as Vehiculo;
    const op = this.data?.id ? this.service.actualizar(this.data.id, v) : this.service.crear(v);
    op.subscribe({
      next: () => this.ref.close('ok'),
      error: err => {
        this.error.set(err?.error?.message ?? 'Error al guardar');
        this.saving.set(false);
      },
    });
  }
}
