export type TableStatus = 'free' | 'occupied' | 'reserved';

export interface Table {
  id: number;
  name: string;
  status: TableStatus;
  capacity: number;
}

export const INITIAL_TABLES: Table[] = [
  { id: 1, name: "Table 1", status: 'occupied', capacity: 2 },
  { id: 2, name: "Table 2", status: 'free', capacity: 4 },
  { id: 3, name: "Table 3", status: 'reserved', capacity: 2 },
  { id: 4, name: "Table 4", status: 'free', capacity: 6 },
  { id: 5, name: "Table 5", status: 'occupied', capacity: 4 },
  { id: 6, name: "Table 6", status: 'free', capacity: 2 },
  { id: 7, name: "Booth 1", status: 'free', capacity: 4 },
  { id: 8, name: "Booth 2", status: 'occupied', capacity: 4 },
  { id: 9, name: "Bar 1", status: 'free', capacity: 1 },
  { id: 10, name: "Bar 2", status: 'free', capacity: 1 },
];

export const INVENTORY_ITEMS = [
  { name: 'Tomatoes', currentStock: 15, unit: 'kg', averageDailyConsumption: 5.2 },
  { name: 'Onions', currentStock: 8, unit: 'kg', averageDailyConsumption: 3.1 },
  { name: 'Flour', currentStock: 50, unit: 'kg', averageDailyConsumption: 12.5 },
  { name: 'Salmon Fillet', currentStock: 3, unit: 'kg', averageDailyConsumption: 2.5 },
  { name: 'Beef Patties', currentStock: 120, unit: 'units', averageDailyConsumption: 45 },
  { name: 'Lettuce', currentStock: 4, unit: 'heads', averageDailyConsumption: 15 },
  { name: 'Olive Oil', currentStock: 2, unit: 'liters', averageDailyConsumption: 0.8 },
  { name: 'Sugar', currentStock: 10, unit: 'kg', averageDailyConsumption: 1.2 },
];

export const POPULAR_DISHES = [
  "SmartBurger",
  "Veggie Delight Pizza",
  "Grilled Salmon",
  "Truffle Fries",
  "Caesar Salad"
];

export const RECENT_SALES_DATA = [
  { day: 'Mon', sales: 1200 },
  { day: 'Tue', sales: 1100 },
  { day: 'Wed', sales: 1400 },
  { day: 'Thu', sales: 1800 },
  { day: 'Fri', sales: 2500 },
  { day: 'Sat', sales: 3200 },
  { day: 'Sun', sales: 2800 },
];