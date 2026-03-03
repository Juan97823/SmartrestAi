"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Loader2, 
  Sparkles,
  BarChart3,
  Target,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react'
import { analizarRentabilidad, AnalisisRentabilidadOutput } from '@/ai/flows/analisis-predictivo-rentabilidad'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import { cn } from '@/lib/utils'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);
};

export default function RentabilidadPage() {
  const [loading, setLoading] = useState(false)
  const [analisis, setAnalisis] = useState<AnalisisRentabilidadOutput | null>(null)

  const ejecutarAnalisis = async () => {
    setLoading(true)
    try {
      // Datos simulados de una sucursal típica en Bogotá
      const res = await analizarRentabilidad({
        sucursalId: 'suc-01',
        ingresosMensuales: 285000000,
        costosFijos: 72000000,
        costosVariables: 135000000,
        mesesProyectados: 6
      })
      setAnalisis(res)
    } catch (err) {
      console.error("Error en análisis de rentabilidad:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-black font-headline text-primary tracking-tight">Análisis de Rentabilidad IA</h1>
          <p className="text-muted-foreground mt-1">Auditoría financiera predictiva y proyecciones en Pesos Colombianos (COP).</p>
        </div>
        <Button 
          size="lg"
          className="bg-accent hover:bg-accent/80 text-accent-foreground shadow-2xl flex gap-3 px-8 rounded-full transition-all hover:scale-105"
          onClick={ejecutarAnalisis}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
          Generar Reporte Predictivo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-2xl border-none bg-white rounded-3xl overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              Proyección de Beneficios (Próximos 6 Meses)
            </CardTitle>
            <CardDescription>Análisis basado en tendencias de mercado y consumo local</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {analisis ? (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analisis.proyeccionBeneficio}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="mes" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 12}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 12}} 
                      tickFormatter={(value) => `$${value/1000000}M`} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [formatCurrency(value), 'Beneficio Est.']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="beneficioEstimado" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: 'hsl(var(--accent))', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 10, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-3xl bg-slate-50/50">
                <TrendingUp className="h-16 w-16 mb-4 opacity-10" />
                <p className="font-medium">Inicia la auditoría IA para visualizar las proyecciones</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-xl border-none bg-primary text-primary-foreground rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                KPIs de Operación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {analisis ? (
                <>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-xs uppercase font-bold text-primary-foreground/70">Margen Actual</span>
                      <div className="text-4xl font-black">{analisis.margenActual}%</div>
                    </div>
                    <Badge className="bg-white text-primary mb-1">Saludable</Badge>
                  </div>
                  <div className="pt-4 border-t border-primary-foreground/20 flex justify-between">
                    <div className="space-y-1">
                      <span className="text-xs uppercase font-bold text-primary-foreground/70">Riesgo Financiero</span>
                      <div className="text-xl font-bold">{analisis.nivelRiesgo}</div>
                    </div>
                    <div className={cn(
                      "p-2 rounded-full",
                      analisis.nivelRiesgo === 'Bajo' ? "bg-emerald-400/20" : "bg-orange-400/20"
                    )}>
                      {analisis.nivelRiesgo === 'Bajo' ? <ArrowUpRight /> : <TrendingDown />}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 flex flex-col items-center gap-2 text-primary-foreground/50 italic">
                  <Loader2 className="h-8 w-8 animate-spin opacity-20" />
                  <span className="text-sm">Esperando auditoría...</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl border-none rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <Target className="h-5 w-5" />
                Optimización IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {analisis?.recomendacionesOptimización.map((rec, i) => (
                  <li key={i} className="text-sm flex gap-3 p-3 bg-secondary/30 rounded-2xl border border-secondary">
                    <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center shrink-0 text-accent-foreground font-bold text-[10px]">
                      {i + 1}
                    </div>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                )) || (
                  <div className="text-center py-6 text-muted-foreground text-xs leading-relaxed">
                    Nuestra IA analizará ingresos vs costos para darte 5 puntos clave de mejora.
                  </div>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
