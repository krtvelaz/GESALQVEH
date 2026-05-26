import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardService } from '../../core/dashboard.service';
import { VehiculoService } from '../../core/vehiculo.service';
import { ClienteService } from '../../core/cliente.service';
import { AlquilerView, Cliente, ResumenDashboard, Vehiculo } from '../../core/models';
import { VehiculoFormDialog } from './vehiculo-form-dialog';
import { ClienteFormDialog } from './cliente-form-dialog';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe, DecimalPipe, MatCardModule, MatTabsModule, MatTableModule,
    MatIconModule, MatButtonModule, MatChipsModule, MatDialogModule, MatTooltipModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private dashService = inject(DashboardService);
  private vehService = inject(VehiculoService);
  private cliService = inject(ClienteService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  resumen = signal<ResumenDashboard>({ alquilados: 0, proximos: 0, vencidos: 0, disponibles: 0 });
  alquilados = signal<AlquilerView[]>([]);
  proximos = signal<AlquilerView[]>([]);
  vencidos = signal<AlquilerView[]>([]);
  disponibles = signal<Vehiculo[]>([]);
  vehiculos = signal<Vehiculo[]>([]);
  clientes = signal<Cliente[]>([]);

  alqColumns = ['id', 'vehiculo', 'cliente', 'periodo', 'estado'];
  vencColumns = ['id', 'vehiculo', 'cliente', 'fechaFin', 'diasVencidos', 'recargo'];
  disponiblesColumns = ['matricula', 'vehiculo', 'tipo', 'precio'];
  vehColumns = ['matricula', 'vehiculo', 'tipo', 'precio', 'disponible', 'acciones'];
  cliColumns = ['nombre', 'dni', 'telefono', 'email', 'acciones'];

  constructor() {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.dashService.resumen().subscribe(r => this.resumen.set(r));
    this.dashService.alquileres('alquilados').subscribe(a => this.alquilados.set(a));
    this.dashService.alquileres('proximos').subscribe(a => this.proximos.set(a));
    this.dashService.alquileres('vencidos').subscribe(a => this.vencidos.set(a));
    this.dashService.disponibles().subscribe(v => this.disponibles.set(v));
    this.vehService.listar().subscribe(v => this.vehiculos.set(v));
    this.cliService.listar().subscribe(c => this.clientes.set(c));
  }

  nuevoVehiculo(): void {
    this.openVeh(null);
  }
  editarVehiculo(v: Vehiculo): void {
    this.openVeh(v);
  }
  eliminarVehiculo(v: Vehiculo): void {
    if (!v.id) return;
    if (!confirm(`¿Eliminar vehículo ${v.matricula}?`)) return;
    this.vehService.eliminar(v.id).subscribe({
      next: () => {
        this.snack.open('Vehículo eliminado', 'OK', { duration: 3000 });
        this.cargarTodo();
      },
      error: () => this.snack.open('Error al eliminar', 'OK', { duration: 3000 }),
    });
  }
  private openVeh(v: Vehiculo | null): void {
    const ref = this.dialog.open(VehiculoFormDialog, { data: v, width: '640px' });
    ref.afterClosed().subscribe(ok => {
      if (ok === 'ok') {
        this.snack.open('Cambios guardados', 'OK', { duration: 3000 });
        this.cargarTodo();
      }
    });
  }

  nuevoCliente(): void {
    this.openCli(null);
  }
  editarCliente(c: Cliente): void {
    this.openCli(c);
  }
  eliminarCliente(c: Cliente): void {
    if (!c.id) return;
    if (!confirm(`¿Eliminar cliente ${c.nombre}?`)) return;
    this.cliService.eliminar(c.id).subscribe({
      next: () => {
        this.snack.open('Cliente eliminado', 'OK', { duration: 3000 });
        this.cargarTodo();
      },
      error: () => this.snack.open('Error al eliminar', 'OK', { duration: 3000 }),
    });
  }
  private openCli(c: Cliente | null): void {
    const ref = this.dialog.open(ClienteFormDialog, { data: c, width: '480px' });
    ref.afterClosed().subscribe(ok => {
      if (ok === 'ok') {
        this.snack.open('Cambios guardados', 'OK', { duration: 3000 });
        this.cargarTodo();
      }
    });
  }
}
