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
  { id: 'suc-01', nombre: 'Centro Histórico', ubicacion: 'Calle Mayor 10' },
  { id: 'suc-02', nombre: 'Zona Norte', ubicacion: 'Av. Libertad 500' },
  { id: 'suc-03', nombre: 'Playa Marina', ubicacion: 'Paseo Marítimo 5' },
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
  "SmartBurger",
  "Pizza Veggie",
  "Salmón a la Parrilla",
  "Patatas Trufadas",
  "Ensalada César"
];

export const RECENT_SALES_DATA = [
  { day: 'Lun', sales: 1200 },
  { day: 'Mar', sales: 1100 },
  { day: 'Mie', sales: 1400 },
  { day: 'Jue', sales: 1800 },
  { day: 'Vie', sales: 2500 },
  { day: 'Sab', sales: 3200 },
  { day: 'Dom', sales: 2800 },
];
