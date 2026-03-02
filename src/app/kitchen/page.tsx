"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

const MOCK_KITCHEN_ORDERS = [
  { id: '1024', table: '4', time: '5m ago', items: ['SmartBurger (x2)', 'Truffle Fries'], priority: 'High' },
  { id: '1021', table: '2', time: '22m ago', items: ['Caesar Salad', 'Grilled Salmon'], priority: 'Medium' },
  { id: '1025', table: '7', time: '2m ago', items: ['Veggie Delight Pizza'], priority: 'Low' },
]

export default function KitchenPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Kitchen Monitor</h1>
        <p className="text-muted-foreground">Incoming orders and preparation status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_KITCHEN_ORDERS.map((order) => (
          <Card key={order.id} className="border-l-4 border-l-primary shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="bg-secondary/30 flex flex-row items-center justify-between pb-2">
              <div className="flex flex-col">
                <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                <span className="text-xs text-muted-foreground font-bold uppercase">Table {order.table}</span>
              </div>
              <Badge 
                className={cn(
                  order.priority === 'High' ? "bg-destructive" : 
                  order.priority === 'Medium' ? "bg-amber-500" : "bg-primary"
                )}
              >
                {order.priority}
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 pt-4">
              <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Elapsed Time: {order.time}</span>
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
              <Button variant="outline" size="sm" className="gap-1 border-destructive text-destructive hover:bg-destructive hover:text-white">
                <AlertCircle className="h-3 w-3" /> Delay
              </Button>
              <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> Complete
              </Button>
            </div>
          </Card>
        ))}

        <Card className="border-dashed border-2 flex items-center justify-center min-h-[300px] text-muted-foreground bg-secondary/10">
          <div className="text-center">
            <p className="text-sm italic">Waiting for new orders...</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}