"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Calendar, Info, Loader2, Sparkles, BrainCircuit } from 'lucide-react'
import { predictDailyDemand, PredictDailyDemandOutput } from '@/ai/flows/ai-demand-prediction-flow'
import { cn } from '@/lib/utils'

export default function AIInsightsPage() {
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictDailyDemandOutput | null>(null)

  const generatePrediction = async () => {
    setLoading(true)
    const today = new Date()
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    
    try {
      const res = await predictDailyDemand({
        date: today.toISOString().split('T')[0],
        dayOfWeek: days[today.getDay()],
        specialEvents: "Festival de música local cercano"
      })
      setPrediction(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generatePrediction()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Analítica Predictiva IA</h1>
          <p className="text-muted-foreground">Modelos de machine learning para previsión de demanda y optimización.</p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/80 text-accent-foreground shadow-lg flex gap-2"
          onClick={generatePrediction}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Regenerar Modelo Diario
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl">
          <div className="h-2 bg-accent w-full" />
          <CardHeader className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  Previsión de Demanda
                </CardTitle>
                <CardDescription>Rendimiento proyectado para hoy</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                Modelo: Gemini 2.5 Flash
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="bg-white pt-6">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-accent animate-spin" />
              </div>
            ) : prediction ? (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/30 flex flex-col items-center text-center">
                    <span className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-bold">Nivel de Demanda</span>
                    <Badge className={cn(
                      "text-lg px-4 py-1",
                      prediction.predictedDemandLevel === 'Very High' ? 'bg-orange-500' :
                      prediction.predictedDemandLevel === 'High' ? 'bg-primary' : 'bg-emerald-500'
                    )}>
                      {prediction.predictedDemandLevel}
                    </Badge>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/30 flex flex-col items-center text-center">
                    <span className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-bold">Comensales Est.</span>
                    <span className="text-3xl font-bold text-primary">{prediction.predictedCovers}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" /> RECOMENDACIÓN DE PERSONAL
                    </h3>
                    <p className="bg-primary/5 p-4 rounded-lg border border-primary/10 leading-relaxed italic text-primary/80">
                      "{prediction.staffingRecommendation}"
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" /> RAZONAMIENTO IA
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {prediction.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Haz clic en el botón para generar el pronóstico de hoy.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-lg">Impacto en Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            {prediction ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <h4 className="text-sm font-bold text-accent-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Prioridades de Stock
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {prediction.inventoryNotes}
                  </p>
                </div>
                <div className="space-y-3">
                   <h4 className="text-xs font-bold text-muted-foreground uppercase">Comparativa Histórica</h4>
                   {[
                     { label: 'Días Similares', value: '+15%' },
                     { label: 'Semana Pasada', value: '-2%' },
                     { label: 'Tendencia Anual', value: '+22%' }
                   ].map((stat, i) => (
                     <div key={i} className="flex justify-between items-center text-sm">
                       <span className="text-muted-foreground">{stat.label}</span>
                       <span className="font-bold text-emerald-500">{stat.value}</span>
                     </div>
                   ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center">
                <Calendar className="h-12 w-12 mb-2 opacity-20" />
                <p className="text-xs">Esperando generación de modelo diario</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
