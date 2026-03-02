export type TableStatus = 'free' | 'occupied' | 'reserved';

export interface Table {
  id: number;
  name: string;
  status: TableStatus;
  capacity: number;
}

export interface Sucursal {
  id: string;
  nombre: string;
  ubicacion: string;
}

export const SUCURSALES: Sucursal[] = [
  { id: 'suc-01', nombre: 'Centro Histórico - Bogotá', ubicacion: 'Calle 11 # 4-14' },
  { id: 'suc-02', nombre: 'Zona Rosa - Medellín', ubicacion: 'Carrera 35 # 8A-38' },
  { id: 'suc-03', nombre: 'Ciudad Jardín - Cali', ubicacion: 'Avenida Cañasgordas' },
];

export const INITIAL_TABLES: Table[] = [
  { id: 1, name: "Mesa 1", status: 'occupied', capacity: 2 },
  { id: 2, name: "Mesa 2", status: 'free', capacity: 4 },
  { id: 3, name: "Mesa 3", status: 'reserved', capacity: 2 },
  { id: 4, name: "Mesa 4", status: 'free', capacity: 6 },
  { id: 5, name: "Mesa 5", status: 'occupied', capacity: 4 },
  { id: 6, name: "Mesa 6", status: 'free', capacity: 2 },
  { id: 7, name: "Box 1", status: 'free', capacity: 4 },
  { id: 8, name: "Box 2", status: 'occupied', capacity: 4 },
  { id: 9, name: "Barra 1", status: 'free', capacity: 1 },
  { id: 10, name: "Barra 2", status: 'free', capacity: 1 },
];

export const INVENTORY_ITEMS = [
  { name: 'Tomates', currentStock: 15, unit: 'kg', averageDailyConsumption: 5.2 },
  { name: 'Cebollas', currentStock: 8, unit: 'kg', averageDailyConsumption: 3.1 },
  { name: 'Harina', currentStock: 50, unit: 'kg', averageDailyConsumption: 12.5 },
  { name: 'Salmón', currentStock: 3, unit: 'kg', averageDailyConsumption: 2.5 },
  { name: 'Carne Burger', currentStock: 120, unit: 'unidades', averageDailyConsumption: 45 },
  { name: 'Lechuga', currentStock: 4, unit: 'unidades', averageDailyConsumption: 15 },
  { name: 'Aceite Oliva', currentStock: 2, unit: 'litros', averageDailyConsumption: 0.8 },
  { name: 'Azúcar', currentStock: 10, unit: 'kg', averageDailyConsumption: 1.2 },
];

export const POPULAR_DISHES = [
  "SmartBurger Especial",
  "Pizza Veggie Criolla",
  "Salmón a la Parrilla",
  "Patatas Trufadas",
  "Ensalada César con Pollo"
];

export const RECENT_SALES_DATA = [
  { day: 'Lun', sales: 4500000 },
  { day: 'Mar', sales: 4100000 },
  { day: 'Mie', sales: 5400000 },
  { day: 'Jue', sales: 6800000 },
  { day: 'Vie', sales: 9500000 },
  { day: 'Sab', sales: 12200000 },
  { day: 'Dom', sales: 10800000 },
];
