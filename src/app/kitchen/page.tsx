"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, AlertCircle, ChefHat } from 'lucide-react'
import { listenOrders, updateOrderStatus, Order } from '@/services/firestore-service'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Escuchando pedidos de la sucursal actual (simulado ID 'suc-01')
    const unsubscribe = listenOrders('suc-01', (newOrders) => {
      setOrders(newOrders.filter(o => o.status === 'preparando' || o.status === 'listo'))
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleComplete = async (id: string) => {
    try {
      await updateOrderStatus(id, 'listo')
      toast({ title: "Pedido actualizado", description: "El pedido está listo para servir." })
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el pedido." })
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ChefHat className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Monitor de Cocina</h1>
          <p className="text-muted-foreground">Pedidos entrantes en tiempo real sincronizados vía WebSockets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center py-20 text-muted-foreground">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4" />
            <p>Conectando con la base de datos en tiempo real...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="col-span-full border-dashed border-2 flex items-center justify-center min-h-[300px] text-muted-foreground bg-secondary/10">
            <div className="text-center">
              <p className="text-lg font-medium">No hay pedidos pendientes</p>
              <p className="text-sm italic">La cocina está al día.</p>
            </div>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-primary shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
              <CardHeader className="bg-secondary/30 flex flex-row items-center justify-between pb-2">
                <div className="flex flex-col">
                  <CardTitle className="text-xl">Pedido #{order.id?.slice(-4)}</CardTitle>
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Mesa {order.tableId}</span>
                </div>
                <Badge 
                  className={cn(
                    order.priority === 'Alta' ? "bg-destructive" : 
                    order.priority === 'Media' ? "bg-amber-500" : "bg-primary"
                  )}
                >
                  {order.priority}
                </Badge>
              </CardHeader>
              <CardContent className="flex-1 pt-4">
                <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Estado: <span className="capitalize font-bold text-primary">{order.status}</span></span>
                </div>
                <ul className="space-y-3">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium p-2 bg-secondary/20 rounded">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-4 bg-white border-t grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="gap-1 border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors">
                  <AlertCircle className="h-3 w-3" /> Retraso
                </Button>
                <Button 
                  size="sm" 
                  className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleComplete(order.id!)}
                  disabled={order.status === 'listo'}
                >
                  <CheckCircle2 className="h-3 w-3" /> {order.status === 'listo' ? 'Listo' : 'Completar'}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
