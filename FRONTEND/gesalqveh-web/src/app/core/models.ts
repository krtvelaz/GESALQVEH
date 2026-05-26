export type TipoVehiculo = 'COCHE' | 'MOTO' | 'CAMION' | 'SUV' | 'FURGONETA';
export type Transmision = 'MANUAL' | 'AUTOMATICA';
export type Combustible = 'GASOLINA' | 'DIESEL' | 'ELECTRICO' | 'HIBRIDO';
export type Categoria = 'ECONOMICO' | 'PREMIUM' | 'LUJO';
export type EstadoAlquiler = 'ACTIVO' | 'FINALIZADO' | 'VENCIDO';

export interface Vehiculo {
  id?: number;
  matricula: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo: TipoVehiculo;
  color?: string;
  precioDiario: number;
  disponible: boolean;
  transmision?: Transmision;
  combustible?: Combustible;
  plazas?: number;
  kilometraje?: number;
  categoria?: Categoria;
  sucursal?: string;
  descripcion?: string;
  urlImagen?: string;
  proximaDisponibilidad?: string;
}

export interface Cliente {
  id?: number;
  nombre: string;
  dni: string;
  telefono?: string;
  email?: string;
}

export interface Alquiler {
  id: number;
  vehiculo: Vehiculo;
  cliente: Cliente;
  fechaInicio: string;
  fechaFin: string;
  fechaDevolucionReal?: string;
  costoTotal: number;
  recargo?: number;
  estado: EstadoAlquiler;
}

export interface AlquilerView {
  id: number;
  vehiculoId: number;
  vehiculoMatricula: string;
  vehiculoDescripcion: string;
  clienteId: number;
  clienteNombre: string;
  clienteDni: string;
  fechaInicio: string;
  fechaFin: string;
  fechaDevolucionReal?: string;
  costoTotal: number;
  recargo: number;
  estado: EstadoAlquiler;
  diasVencidos: number;
}

export interface ResumenDashboard {
  alquilados: number;
  proximos: number;
  vencidos: number;
  disponibles: number;
}

export interface VehiculoFilter {
  matricula?: string;
  marca?: string;
  modelo?: string;
  anio?: number;
  tipo?: TipoVehiculo;
  color?: string;
  precioMin?: number;
  precioMax?: number;
  disponible?: boolean;
  transmision?: Transmision;
  combustible?: Combustible;
  plazas?: number;
  kilometrajeMax?: number;
  categoria?: Categoria;
  sucursal?: string;
}
