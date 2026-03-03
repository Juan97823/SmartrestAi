
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  Sparkles,
  TrendingDown,
  Loader2,
  Plus,
  RefreshCw,
  Database
} from 'lucide-react'
import { 
  predictiveInventoryAlerts, 
  PredictiveInventoryAlertsOutput 
} from '@/ai/flows/predictive-inventory-alerts'
import { cn } from '@/lib/utils'
import { useBranch } from '@/components/branch-context'
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, where, addDoc, serverTimestamp, updateDoc, doc, writeBatch, getDocs } from 'firebase/firestore'
import { useToast } from '@/hooks/use-toast'

export default function InventoryPage() {
  const { selectedBranch } = useBranch()
  const db = useFirestore()
  const { toast } = useToast()
  const [loadingAi, setLoadingAi] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [aiAlerts, setAiAlerts] = useState<PredictiveInventoryAlertsOutput | null>(null)

  // Consulta real de ingredientes filtrada por sucursal
  const inventoryQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'ingredients'),
      where('branchId', '==', selectedBranch.id)
    )
  }, [db, selectedBranch.id])

  const { data: ingredients, isLoading: loadingInventory } = useCollection(inventoryQuery)

  const getAiInsights = async () => {
    if (!ingredients || ingredients.length === 0) return
    
    setLoadingAi(true)
    try {
      const result = await predictiveInventoryAlerts({
        inventoryItems: ingredients.map(item => ({
          name: item.name,
          currentStock: item.currentStock,
          unit: item.unitOfMeasure,
          averageDailyConsumption: item.averageDailyConsumption || 1
        }))
      })
      setAiAlerts(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingAi(false)
    }
  }

  const handleInitializeInventory = async () => {
    setInitializing(true)
    try {
      const batch = writeBatch(db)
      const defaultItems = [
        { name: 'Tomates', currentStock: 15, unitOfMeasure: 'kg', averageDailyConsumption: 5.2, minStockLevel: 10 },
        { name: 'Cebollas', currentStock: 8, unitOfMeasure: 'kg', averageDailyConsumption: 3.1, minStockLevel: 5 },
        { name: 'Harina', currentStock: 50, unitOfMeasure: 'kg', averageDailyConsumption: 12.5, minStockLevel: 20 },
        { name: 'Salmón', currentStock: 3, unitOfMeasure: 'kg', averageDailyConsumption: 2.5, minStockLevel: 5 },
        { name: 'Carne Burger', currentStock: 120, unitOfMeasure: 'unidades', averageDailyConsumption: 45, minStockLevel: 100 },
        { name: 'Lechuga', currentStock: 4, unitOfMeasure: 'unidades', averageDailyConsumption: 15, minStockLevel: 10 }
      ]

      defaultItems.forEach(item => {
        const newRef = doc(collection(db, 'ingredients'))
        batch.set(newRef, {
          ...item,
          branchId: selectedBranch.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      })

      await batch.commit()
      toast({ title: "Inventario Inicializado", description: `Se han creado los insumos base para ${selectedBranch.nombre}.` })
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo inicializar el inventario." })
    } finally {
      setInitializing(false)
    }
  }

  useEffect(() => {
    if (ingredients && ingredients.length > 0) {
      getAiInsights()
    } else {
      setAiAlerts(null)
    }
  }, [ingredients?.length])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Inventario Inteligente</h1>
          <p className="text-muted-foreground">Suministros de <span className="text-primary font-bold">{selectedBranch.nombre}</span></p>
        </div>
        <div className="flex gap-2">
          {(!ingredients || ingredients.length === 0) && !loadingInventory && (
            <Button 
              variant="outline" 
              onClick={handleInitializeInventory} 
              disabled={initializing}
              className="border-primary text-primary hover:bg-primary/10"
            >
              {initializing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
              Inicializar Stock
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={getAiInsights} 
            disabled={loadingAi || !ingredients || ingredients.length === 0}
            className="flex gap-2"
          >
            {loadingAi ? <Loader2 className="h-4 w-4 animate-spin text-accent" /> : <Sparkles className="h-4 w-4 text-accent" />}
            Consultar IA
          </Button>
        </div>
      </div>

      {aiAlerts && aiAlerts.atRiskIngredients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiAlerts.atRiskIngredients.map((alert, idx) => (
            <Alert key={idx} variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive shadow-sm">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-bold">Riesgo IA: {alert.name}</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p className="text-sm italic">{alert.reason}</p>
                <div className="flex items-center gap-4 text-xs bg-white/50 p-2 rounded border border-destructive/10">
                  <span className="font-bold">Quedan ~{alert.estimatedDaysRemaining} días</span>
                  <div className="flex items-center gap-1 text-emerald-700">
                    <TrendingDown className="h-3 w-3" />
                    <span>Sugerencia: Pedir +{alert.reorderRecommendation} {alert.unit}</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Card className="border-none shadow-xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-xl">Monitor de Suministros</CardTitle>
          <CardDescription>Datos en tiempo real sincronizados con la cocina</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/30 text-muted-foreground uppercase text-[10px] tracking-widest font-bold">
                  <th className="text-left py-4 px-6">Ingrediente</th>
                  <th className="text-left py-4 px-6">Stock Actual</th>
                  <th className="text-left py-4 px-6">Consumo Diario</th>
                  <th className="text-left py-4 px-6">Estado</th>
                  <th className="text-right py-4 px-6">Gestión</th>
                </tr>
              </thead>
              <tbody>
                {loadingInventory ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary opacity-20" />
                      <p className="mt-2 text-muted-foreground italic">Consultando almacén...</p>
                    </td>
                  </tr>
                ) : !ingredients || ingredients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-2 opacity-10" />
                      <p>No hay ingredientes registrados en esta sucursal.</p>
                      <p className="text-xs">Usa el botón "Inicializar Stock" para empezar.</p>
                    </td>
                  </tr>
                ) : (
                  ingredients.map((item) => {
                    const isLow = item.currentStock <= (item.minStockLevel || 10)
                    return (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="py-5 px-6 font-bold text-slate-700">{item.name}</td>
                        <td className="py-5 px-6">
                          <span className="text-lg font-medium">{item.currentStock}</span>
                          <span className="text-muted-foreground ml-1">{item.unitOfMeasure}</span>
                        </td>
                        <td className="py-5 px-6 text-muted-foreground">
                          {item.averageDailyConsumption || 0} {item.unitOfMeasure}/día
                        </td>
                        <td className="py-5 px-6">
                          <Badge 
                            variant={isLow ? 'destructive' : 'secondary'} 
                            className={cn(
                              "px-3 py-1 text-[10px] uppercase",
                              !isLow ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'animate-pulse'
                            )}
                          >
                            {isLow ? 'Stock Crítico' : 'Saludable'}
                          </Badge>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <RefreshCw className="h-4 w-4 text-slate-400" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
