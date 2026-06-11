"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, AlertCircle, ChefHat, Loader2, ClipboardList } from 'lucide-react'
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, where, orderBy, updateDoc, doc } from '@/firebase/firestore'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useBranch } from '@/components/branch-context'

export default function KitchenPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const { selectedBranch } = useBranch()
  
  const ordersQuery = useMemoFirebase(() => {
    if (!selectedBranch?.id) return null;
    return query(
      collection(db, 'orders'),
      where('branchId', '==', selectedBranch.id),
      where('status', 'in', ['preparando', 'listo']),
      orderBy('createdAt', 'desc')
    )
  }, [db, selectedBranch?.id])

  const { data: orders, isLoading, error } = useCollection(ordersQuery)

  const handleComplete = async (id: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { 
        status: 'listo',
        updatedAt: new Date().toISOString()
      })
      toast({ title: "Pedido actualizado", description: "El plato está listo." })
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar." })
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHat className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Monitor de Cocina</h1>
            <p className="text-muted-foreground">{selectedBranch.nombre}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-primary mb-2" />
            <p>Conectando con cocina...</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <Card className="col-span-full border-dashed flex flex-col items-center justify-center p-20 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mb-2 opacity-20" />
            <p>No hay pedidos pendientes en esta sucursal.</p>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-primary shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Mesa {order.tableId}</CardTitle>
                <Badge variant={order.priority === 'Alta' ? 'destructive' : 'default'}>
                  {order.priority}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{order.status}</span>
                </div>
                <ul className="space-y-2">
                  {order.items.map((item: string, i: number) => (
                    <li key={i} className="text-sm p-2 bg-secondary/50 rounded">{item}</li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => handleComplete(order.id!)}
                  disabled={order.status === 'listo'}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {order.status === 'listo' ? 'Listo' : 'Completar'}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}