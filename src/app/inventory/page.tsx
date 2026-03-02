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
  TrendingDown
} from 'lucide-react'
import { INVENTORY_ITEMS } from '@/lib/mock-data'
import { 
  predictiveInventoryAlerts, 
  PredictiveInventoryAlertsOutput 
} from '@/ai/flows/predictive-inventory-alerts'

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
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Inventory Control</h1>
          <p className="text-muted-foreground">AI-powered stock prediction and management.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={getAiInsights} 
          disabled={loading}
          className="flex gap-2"
        >
          <Sparkles className={cn("h-4 w-4 text-accent", loading && "animate-spin")} />
          Refresh AI Insights
        </Button>
      </div>

      {aiAlerts && aiAlerts.atRiskIngredients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiAlerts.atRiskIngredients.map((alert, idx) => (
            <Alert key={idx} variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-bold">Stock Risk: {alert.name}</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p>{alert.reason}</p>
                <div className="flex items-center gap-4 text-sm bg-white/50 p-2 rounded">
                  <span className="font-bold">Estimated Remaining: {alert.estimatedDaysRemaining} days</span>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    <span>Recommend: +{alert.reorderRecommendation} {alert.unit}</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Stock Levels</CardTitle>
          <CardDescription>Real-time inventory database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-3 px-4 font-medium">Item Name</th>
                  <th className="text-left py-3 px-4 font-medium">Current Stock</th>
                  <th className="text-left py-3 px-4 font-medium">Avg. Daily Usage</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Action</th>
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
                        {item.averageDailyConsumption} {item.unit}/day
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={isLow ? 'destructive' : 'secondary'} className={!isLow ? 'bg-emerald-100 text-emerald-700' : ''}>
                          {isLow ? 'Low Stock' : 'Healthy'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="sm">Update</Button>
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}