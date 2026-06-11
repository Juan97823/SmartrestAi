/**
 * @fileOverview Servicio para operaciones en tiempo real con Firestore.
 */
import {
  collection,
  addDoc,
  query,
  orderBy,
  updateDoc,
  doc,
  where,
  getDocs,
} from '@/firebase/firestore';
import { useFirestore } from '@/firebase';

export interface Order {
  id?: string;
  tableId: string;
  items: string[];
  status: 'preparando' | 'listo' | 'servido' | 'cancelado';
  priority: 'Baja' | 'Media' | 'Alta';
  createdAt: any;
  branchId: string;
}

// Guardar un nuevo pedido
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
  const db = useFirestore();
  return await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: new Date().toISOString(),
  });
};

// Escuchar pedidos en tiempo real por sucursal
export const listenOrders = (branchId: string, callback: (orders: Order[]) => void) => {
  const db = useFirestore();
  const q = query(
    collection(db, 'orders'),
    where('branchId', '==', branchId),
    orderBy('createdAt', 'desc')
  );

  let lastItems: string | null = null;
  const refresh = async () => {
    const snapshot = await getDocs(q);
    const orders = snapshot.map((docItem) => ({
      id: docItem.id,
      ...docItem,
    })) as Order[];
    const current = JSON.stringify(orders);
    if (current !== lastItems) {
      lastItems = current;
      callback(orders);
    }
  };

  const intervalId = setInterval(refresh, 1000);
  refresh();

  return () => clearInterval(intervalId);
};

// Actualizar estado de pedido
export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const db = useFirestore();
  const orderRef = doc(db, 'orders', orderId);
  return await updateDoc(orderRef, { status });
};
