
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ClipboardList, 
  Plus, 
  Search, 
  ShoppingCart, 
  Sparkles,
  Loader2
} from 'lucide-react'
import { aiDishRecommendation } from '@/ai/flows/ai-dish-recommendation'
import { useFirestore } from '@/firebase'
import { collection, addDoc, serverTimestamp } from '@/firebase/firestore'
import { POPULAR_DISHES } from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'
import { useBranch } from '@/components/branch-context'
import { cn } from '@/lib/utils'

export default function OrdersPage() {
  const [currentOrder, setCurrentOrder] = useState<string[]>([])
  const [loadingAi, setLoadingAi] = useState(false)
  const [sending, setSending] = useState(false)
  const [recommendations, setRecommendations] = useState<{items: string[], reason: string} | null>(null)
  
  const db = useFirestore()
  const { toast } = useToast()
  const { selectedBranch } = useBranch()

  const addToOrder = (dish: string) => {
    setCurrentOrder(prev => [...prev, dish])
  }

  const getAiUpsell = async () => {
    if (currentOrder.length === 0) {
      toast({ title: "Pedido vacío", description: "Añade platos antes de pedir recomendaciones." })
      return
    }
    setLoadingAi(true)
    try {
      const res = await aiDishRecommendation({
        orderedDishNames: currentOrder,
        popularItemsRecently: POPULAR_DISHES,
        occasionOrTime: "Servicio de Cena"
      })
      setRecommendations({
        items: res.recommendedDishes,
        reason: res.reasoning
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingAi(false)
    }
  }

  const handleSubmitOrder = async () => {
    if (currentOrder.length === 0) return
    setSending(true)
    try {
      // Guardar directamente en Firestore usando el contexto de la sucursal seleccionada
      await addDoc(collection(db, 'orders'), {
        tableId: Math.floor(Math.random() * 10) + 1, // Mesa aleatoria
        items: currentOrder,
        status: 'preparando',
        priority: 'Media',
        branchId: selectedBranch.id,
        createdAt: serverTimestamp()
      })

      toast({ title: "¡Pedido Enviado!", description: `Registrado en ${selectedBranch.nombre}` })
      setCurrentOrder([])
      setRecommendations(null)
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo enviar el pedido." })
    } finally {
      setSending(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Nueva orden para <span className="text-primary font-bold">{selectedBranch.nombre}</span></p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          Sucursal ID: {selectedBranch.id}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Menú del Día</CardTitle>
                <div className="relative w-48">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar plato..." className="pl-8 h-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {POPULAR_DISHES.map((dish) => (
                  <Button 
                    key={dish} 
                    variant="outline" 
                    className="justify-between h-auto py-4 px-4 hover:bg-primary hover:text-white transition-all group border-secondary text-left"
                    onClick={() => addToOrder(dish)}
                  >
                    <span className="font-medium whitespace-normal">{dish}</span>
                    <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {recommendations && (
            <Card className="bg-accent/10 border-accent/30 overflow-hidden animate-in zoom-in duration-300">
              <div className="p-1 bg-accent flex items-center justify-center gap-2">
                 <Sparkles className="h-3 w-3 text-white" />
                 <span className="text-[10px] font-bold text-white uppercase tracking-widest">Asistente de Upsell IA</span>
              </div>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">Sugerencias para el cliente</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {recommendations.items.map(rec => (
                      <Button 
                        key={rec} 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white border-accent/20 hover:bg-accent hover:text-white"
                        onClick={() => {
                          addToOrder(rec)
                          setRecommendations(null)
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" /> {rec}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm italic text-muted-foreground leading-relaxed border-l-2 border-accent pl-4">
                    "{recommendations.reason}"
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="lg:col-span-5 h-fit shadow-xl border-none overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cesta de {selectedBranch.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="min-h-[200px] max-h-[400px] overflow-y-auto space-y-3">
              {currentOrder.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                  <ClipboardList className="h-12 w-12 mb-2" />
                  <p>No hay platos seleccionados</p>
                </div>
              ) : (
                currentOrder.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b last:border-0 group animate-in slide-in-from-left-2">
                    <span className="font-medium">{item}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive h-7 px-2"
                      onClick={() => setCurrentOrder(prev => prev.filter((_, idx) => idx !== i))}
                    >
                      Quitar
                    </Button>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Estimado</span>
                <span>{formatCurrency(currentOrder.length * 35000)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  onClick={getAiUpsell}
                  disabled={loadingAi || currentOrder.length === 0}
                >
                  {loadingAi ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-accent" />}
                  Sugerir IA
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleSubmitOrder}
                  disabled={sending || currentOrder.length === 0}
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Enviar Comanda
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
