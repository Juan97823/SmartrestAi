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

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Performance Reports</h1>
          <p className="text-muted-foreground">Deep dive into sales metrics and financial health.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" /> Filter Date
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Visualizing sales growth over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RECENT_SALES_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
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
            <CardTitle>Quick Metrics</CardTitle>
            <CardDescription>Key performance summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                <span className="text-emerald-500 text-xs font-bold">+12% vs last month</span>
              </div>
              <div className="text-2xl font-bold">$42,500.00</div>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Avg. Ticket Size</span>
                <span className="text-blue-500 text-xs font-bold">+$4.20 per order</span>
              </div>
              <div className="text-2xl font-bold">$38.40</div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Food Cost %</span>
                <span className="text-emerald-500 text-xs font-bold">In Target Range</span>
              </div>
              <div className="text-2xl font-bold">28.4%</div>
            </div>

            <div className="pt-4">
               <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">Top Selling Category</h4>
               <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                 <div className="h-10 w-10 rounded bg-primary flex items-center justify-center text-white">
                   <TrendingUp className="h-5 w-5" />
                 </div>
                 <div>
                   <div className="font-bold">Gourmet Burgers</div>
                   <div className="text-xs text-muted-foreground">32% of total volume</div>
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Tax Summary', icon: FileText, date: 'Oct 2023', size: '2.4 MB' },
          { title: 'Inventory Reconciliation', icon: FileText, date: 'Oct 2023', size: '1.1 MB' },
          { title: 'Employee Payroll', icon: FileText, date: 'Sep 2023', size: '0.8 MB' },
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