
"use client"

import React, { useState } from 'react'
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
  Target
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
      const res = await analizarRentabilidad({
        sucursalId: 'suc-01',
        ingresosMensuales: 280000000,
        costosFijos: 65000000,
        costosVariables: 120000000,
        mesesProyectados: 6
      })
      setAnalisis(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Análisis de Rentabilidad con IA</h1>
          <p className="text-muted-foreground">Proyecciones financieras en Pesos Colombianos (COP).</p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/80 text-accent-foreground shadow-lg flex gap-2"
          onClick={ejecutarAnalisis}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generar Auditoría IA
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-xl border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Proyección de Beneficios (COP)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analisis ? (
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analisis.proyeccionBeneficio}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `$${value/1000000}M`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="beneficioEstimado" stroke="hsl(var(--primary))" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                Inicia el análisis para ver la proyección
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado Financiero (COP)</CardTitle>
            </CardHeader>
            <CardContent>
              {analisis ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                    <span className="text-sm">Margen Operativo</span>
                    <Badge className="bg-emerald-500">{analisis.margenActual}%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                    <span className="text-sm">Nivel de Riesgo</span>
                    <Badge variant={analisis.nivelRiesgo === 'Alto' ? 'destructive' : 'default'}>
                      {analisis.nivelRiesgo}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-center py-8 text-muted-foreground italic">Esperando datos...</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Sugerencias IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analisis?.recomendacionesOptimización.map((rec, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {rec}
                  </li>
                )) || <p className="text-xs text-muted-foreground">Ejecuta el análisis para recibir recomendaciones personalizadas.</p>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
