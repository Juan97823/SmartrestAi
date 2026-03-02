"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Utensils, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  Cell
} from 'recharts'
import { RECENT_SALES_DATA } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Executive Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of SmartRest AI operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,840.50</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-emerald-500 font-medium flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +12.5%
              </span> 
              from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Covers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-emerald-500 font-medium flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +8%
              </span> 
              capacity utilized
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Table Occupancy</CardTitle>
            <Utensils className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: '75%' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 items</div>
            <p className="text-xs text-destructive mt-1 font-medium">Critical stock levels detected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sales Trend (Weekly)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RECENT_SALES_DATA}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                    {RECENT_SALES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? 'hsl(var(--accent))' : 'hsl(var(--primary))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Live Order Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: '1024', table: '4', items: 3, status: 'Preparing', time: '5m' },
                { id: '1023', table: '1', items: 5, status: 'Ready', time: '12m' },
                { id: '1022', table: '8', items: 2, status: 'Served', time: '18m' },
                { id: '1021', table: '2', items: 4, status: 'Preparing', time: '22m' },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Order #{order.id}</span>
                    <span className="text-xs text-muted-foreground">Table {order.table} • {order.items} items</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant={order.status === 'Ready' ? 'default' : 'secondary'} className={order.status === 'Ready' ? 'bg-emerald-500' : ''}>
                      {order.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground mt-1 flex items-center">
                      <Clock className="h-2.5 w-2.5 mr-0.5" /> {order.time} ago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}