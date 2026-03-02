"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Calendar, ArrowRight, TrendingUp } from 'lucide-react'
import { RECENT_SALES_DATA } from '@/lib/mock-data'
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

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Reportes de Rendimiento</h1>
          <p className="text-muted-foreground">Métricas de ventas y salud financiera en COP.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" /> Filtrar Fecha
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tendencias de Ingresos (COP)</CardTitle>
            <CardDescription>Visualización del crecimiento en los últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RECENT_SALES_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000000}M`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2 }} 
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas Clave</CardTitle>
            <CardDescription>Resumen de rendimiento financiero</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Ingresos Totales (Mes)</span>
                <span className="text-emerald-500 text-xs font-bold">+12% vs mes anterior</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(245000000)}</div>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Ticket Promedio</span>
                <span className="text-blue-500 text-xs font-bold">+ $8.500 por orden</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(85400)}</div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Costo de Alimentos %</span>
                <span className="text-emerald-500 text-xs font-bold">Dentro del objetivo</span>
              </div>
              <div className="text-2xl font-bold">28.4%</div>
            </div>

            <div className="pt-4">
               <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">Categoría Más Vendida</h4>
               <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                 <div className="h-10 w-10 rounded bg-primary flex items-center justify-center text-white">
                   <TrendingUp className="h-5 w-5" />
                 </div>
                 <div>
                   <div className="font-bold">Hamburguesas Gourmet</div>
                   <div className="text-xs text-muted-foreground">32% del volumen total</div>
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Resumen Impuestos (IVA/Impoconsumo)', icon: FileText, date: 'Oct 2023', size: '2.4 MB' },
          { title: 'Conciliación de Inventario', icon: FileText, date: 'Oct 2023', size: '1.1 MB' },
          { title: 'Nómina de Empleados', icon: FileText, date: 'Sep 2023', size: '0.8 MB' },
        ].map((report, idx) => (
          <Card key={idx} className="hover:border-primary transition-colors cursor-pointer group">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-secondary group-hover:bg-primary transition-colors">
                  <report.icon className="h-6 w-6 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{report.title}</h3>
                  <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
