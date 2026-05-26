import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlquilerService } from '../../core/alquiler.service';
import { ClientSessionService } from '../../core/client-session.service';
import { Alquiler } from '../../core/models';
import { ActionDialog } from './action-dialog';

@Component({
  selector: 'app-alquileres-list',
  imports: [
    DatePipe, DecimalPipe, RouterLink, MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatTooltipModule, MatDialogModule,
  ],
  templateUrl: './alquileres-list.html',
  styleUrl: './alquileres-list.scss',
})
export class AlquileresList {
  private service = inject(AlquilerService);
  private session = inject(ClientSessionService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  cliente = computed(() => this.session.cliente());
  alquileres = signal<Alquiler[]>([]);
  columns = ['id', 'vehiculo', 'periodo', 'costo', 'estado', 'acciones'];

  constructor() {
    this.cargar();
  }

  private cargar(): void {
    const c = this.cliente();
    if (!c) {
      this.alquileres.set([]);
      return;
    }
    this.service.listarPorDni(c.dni).subscribe(a => this.alquileres.set(a));
  }

  devolver(a: Alquiler): void {
    const ref = this.dialog.open(ActionDialog, {
      data: { modo: 'devolver', alquiler: a },
      width: '420px',
    });
    ref.afterClosed().subscribe(ok => {
      if (ok === 'ok') {
        this.snack.open('Devolución registrada', 'OK', { duration: 3000 });
        this.cargar();
      }
    });
  }

  extender(a: Alquiler): void {
    const ref = this.dialog.open(ActionDialog, {
      data: { modo: 'extender', alquiler: a },
      width: '420px',
    });
    ref.afterClosed().subscribe(ok => {
      if (ok === 'ok') {
        this.snack.open('Alquiler extendido', 'OK', { duration: 3000 });
        this.cargar();
      }
    });
  }
}
