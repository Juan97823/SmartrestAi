"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Box, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight,
  Sparkles,
  TrendingDown,
  Loader2
} from 'lucide-react'
import { INVENTORY_ITEMS } from '@/lib/mock-data'
import { 
  predictiveInventoryAlerts, 
  PredictiveInventoryAlertsOutput 
} from '@/ai/flows/predictive-inventory-alerts'
import { cn } from '@/lib/utils'

export default function InventoryPage() {
  const [loading, setLoading] = useState(false)
  const [aiAlerts, setAiAlerts] = useState<PredictiveInventoryAlertsOutput | null>(null)

  const getAiInsights = async () => {
    setLoading(true)
    try {
      const result = await predictiveInventoryAlerts({
        inventoryItems: INVENTORY_ITEMS
      })
      setAiAlerts(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAiInsights()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Control de Inventario</h1>
          <p className="text-muted-foreground">Predicción de stock y gestión asistida por IA.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={getAiInsights} 
          disabled={loading}
          className="flex gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin text-accent" /> : <Sparkles className="h-4 w-4 text-accent" />}
          Actualizar Insights IA
        </Button>
      </div>

      {aiAlerts && aiAlerts.atRiskIngredients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiAlerts.atRiskIngredients.map((alert, idx) => (
            <Alert key={idx} variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-bold">Riesgo de Stock: {alert.name}</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p>{alert.reason}</p>
                <div className="flex items-center gap-4 text-sm bg-white/50 p-2 rounded">
                  <span className="font-bold">Días estimados: {alert.estimatedDaysRemaining} días</span>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    <span>Sugerencia: +{alert.reorderRecommendation} {alert.unit}</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Niveles de Stock Actual</CardTitle>
          <CardDescription>Base de datos de suministros en tiempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-3 px-4 font-medium">Nombre del Ítem</th>
                  <th className="text-left py-3 px-4 font-medium">Stock Actual</th>
                  <th className="text-left py-3 px-4 font-medium">Consumo Diario Prom.</th>
                  <th className="text-left py-3 px-4 font-medium">Estado</th>
                  <th className="text-right py-3 px-4 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {INVENTORY_ITEMS.map((item, idx) => {
                  const isLow = item.currentStock < item.averageDailyConsumption * 3
                  return (
                    <tr key={idx} className="border-b hover:bg-secondary/20 transition-colors">
                      <td className="py-4 px-4 font-medium">{item.name}</td>
                      <td className="py-4 px-4">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="py-4 px-4">
                        {item.averageDailyConsumption} {item.unit}/día
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={isLow ? 'destructive' : 'secondary'} className={!isLow ? 'bg-emerald-100 text-emerald-700' : ''}>
                          {isLow ? 'Stock Bajo' : 'Saludable'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="sm">Actualizar</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
