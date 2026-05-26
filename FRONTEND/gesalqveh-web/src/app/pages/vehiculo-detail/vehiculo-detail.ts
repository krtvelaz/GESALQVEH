import { Component, inject, signal, OnInit, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoService } from '../../core/vehiculo.service';
import { Vehiculo } from '../../core/models';
import { AlquilarDialog } from './alquilar-dialog';

@Component({
  selector: 'app-vehiculo-detail',
  imports: [DecimalPipe, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatDialogModule],
  templateUrl: './vehiculo-detail.html',
  styleUrl: './vehiculo-detail.scss',
})
export class VehiculoDetail implements OnInit {
  @Input() id!: string;
  private service = inject(VehiculoService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  vehiculo = signal<Vehiculo | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.service.obtener(Number(this.id)).subscribe({
      next: v => this.vehiculo.set(v),
      error: () => this.router.navigate(['/vehiculos']),
    });
  }

  alquilar(): void {
    const v = this.vehiculo();
    if (!v || !v.disponible) return;
    const ref = this.dialog.open(AlquilarDialog, { data: { vehiculo: v }, width: '480px' });
    ref.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.snack.open('Alquiler creado correctamente', 'OK', { duration: 3000 });
        this.cargar();
      }
    });
  }
}
