"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Info, Plus } from 'lucide-react'
import { INITIAL_TABLES, Table } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES)

  const toggleStatus = (id: number) => {
    setTables(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus: Record<string, 'free' | 'occupied' | 'reserved'> = {
          'free': 'occupied',
          'occupied': 'reserved',
          'reserved': 'free'
        }
        return { ...t, status: nextStatus[t.status] }
      }
      return t
    }))
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      free: 'Libre',
      occupied: 'Ocupada',
      reserved: 'Reservada'
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Gestión del Salón</h1>
          <p className="text-muted-foreground">Ocupación y estado de mesas en tiempo real.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1 flex gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" /> Libre
          </Badge>
          <Badge variant="outline" className="px-3 py-1 flex gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" /> Ocupada
          </Badge>
          <Badge variant="outline" className="px-3 py-1 flex gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500" /> Reservada
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tables.map((table) => (
          <Card 
            key={table.id} 
            className={cn(
              "cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-t-4",
              table.status === 'free' ? "border-t-emerald-500" : 
              table.status === 'occupied' ? "border-t-blue-500" : "border-t-amber-500"
            )}
            onClick={() => toggleStatus(table.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{table.name}</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                      <Info className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detalles de {table.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado</span>
                        <Badge>{getStatusLabel(table.status)}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacidad</span>
                        <span className="font-medium">{table.capacity} Personas</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Último Pedido</span>
                        <span className="font-medium">hace 15m</span>
                      </div>
                      <Button className="w-full">Abrir Nuevo Pedido</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{table.capacity} Sillas</span>
              </div>
              <div className="flex justify-center py-4">
                <div className={cn(
                  "h-16 w-16 rounded-full flex items-center justify-center text-white font-bold",
                  table.status === 'free' ? "bg-emerald-500/10 text-emerald-600 border-2 border-emerald-200" : 
                  table.status === 'occupied' ? "bg-blue-500 text-white shadow-md" : "bg-amber-500 text-white"
                )}>
                  {table.id}
                </div>
              </div>
              <div className="text-center mt-2">
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  table.status === 'free' ? "text-emerald-600" : 
                  table.status === 'occupied' ? "text-blue-600" : "text-amber-600"
                )}>
                  {getStatusLabel(table.status)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Card className="border-dashed flex items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors h-full min-h-[220px]">
          <div className="flex flex-col items-center text-muted-foreground">
            <Plus className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">Agregar Mesa</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
