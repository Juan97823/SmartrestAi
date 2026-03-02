/**
 * @fileOverview Servicio para operaciones en tiempo real con Firestore.
 */
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  doc,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  return await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: Timestamp.now()
  });
};

// Escuchar pedidos en tiempo real por sucursal
export const listenOrders = (branchId: string, callback: (orders: Order[]) => void) => {
  const q = query(
    collection(db, 'orders'), 
    where('branchId', '==', branchId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
    callback(orders);
  });
};

// Actualizar estado de pedido
export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const orderRef = doc(db, 'orders', orderId);
  return await updateDoc(orderRef, { status });
};
