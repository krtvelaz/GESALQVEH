import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VehiculoService } from '../../core/vehiculo.service';
import { AlquilerService } from '../../core/alquiler.service';
import { Vehiculo, VehiculoFilter } from '../../core/models';

@Component({
  selector: 'app-vehiculos-list',
  imports: [
    ReactiveFormsModule, RouterLink, DecimalPipe, DatePipe,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule,
  ],
  templateUrl: './vehiculos-list.html',
  styleUrl: './vehiculos-list.scss',
})
export class VehiculosList {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);
  private alquilerService = inject(AlquilerService);

  vehiculos = signal<Vehiculo[]>([]);
  loading = signal<boolean>(false);

  filterForm = this.fb.group({
    marca: [''],
    tipo: [''],
    transmision: [''],
    combustible: [''],
    categoria: [''],
    precioMin: [null as number | null],
    precioMax: [null as number | null],
    disponible: [null as boolean | null],
  });

  tipos = ['COCHE', 'MOTO', 'CAMION', 'SUV', 'FURGONETA'];
  transmisiones = ['MANUAL', 'AUTOMATICA'];
  combustibles = ['GASOLINA', 'DIESEL', 'ELECTRICO', 'HIBRIDO'];
  categorias = ['ECONOMICO', 'PREMIUM', 'LUJO'];

  constructor() {
    this.buscar();
  }

  buscar(): void {
    const raw = this.filterForm.value;
    const filter: VehiculoFilter = {};
    if (raw.marca) filter.marca = raw.marca;
    if (raw.tipo) filter.tipo = raw.tipo as VehiculoFilter['tipo'];
    if (raw.transmision) filter.transmision = raw.transmision as VehiculoFilter['transmision'];
    if (raw.combustible) filter.combustible = raw.combustible as VehiculoFilter['combustible'];
    if (raw.categoria) filter.categoria = raw.categoria as VehiculoFilter['categoria'];
    if (raw.precioMin != null) filter.precioMin = raw.precioMin;
    if (raw.precioMax != null) filter.precioMax = raw.precioMax;
    if (raw.disponible != null) filter.disponible = raw.disponible;

    this.loading.set(true);
    forkJoin({
      vehiculos: this.vehiculoService.buscar(filter),
      alquileres: this.alquilerService.listarActivos(),
    }).subscribe({
      next: ({ vehiculos, alquileres }) => {
        const byVehiculo = new Map<number, string>();
        for (const a of alquileres) {
          const vid = a.vehiculo?.id;
          if (vid == null) continue;
          const fin = new Date(a.fechaFin);
          fin.setDate(fin.getDate() + 1);
          const iso = fin.toISOString().slice(0, 10);
          const prev = byVehiculo.get(vid);
          if (!prev || prev < iso) byVehiculo.set(vid, iso);
        }
        const enriched = vehiculos.map(v => ({
          ...v,
          proximaDisponibilidad: !v.disponible && v.id != null ? byVehiculo.get(v.id) : undefined,
        }));
        this.vehiculos.set(enriched);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  limpiar(): void {
    this.filterForm.reset({ disponible: null });
    this.buscar();
  }
}
