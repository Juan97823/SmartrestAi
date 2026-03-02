"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Calendar, Info, Loader2, Sparkles, BrainCircuit } from 'lucide-react'
import { predictDailyDemand, PredictDailyDemandOutput } from '@/ai/flows/ai-demand-prediction-flow'

export default function AIInsightsPage() {
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictDailyDemandOutput | null>(null)

  const generatePrediction = async () => {
    setLoading(true)
    const today = new Date()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    try {
      const res = await predictDailyDemand({
        date: today.toISOString().split('T')[0],
        dayOfWeek: days[today.getDay()],
        specialEvents: "Local music festival nearby"
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
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">AI Predictive Analytics</h1>
          <p className="text-muted-foreground">Machine learning models for demand forecasting and optimization.</p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/80 text-accent-foreground shadow-lg flex gap-2"
          onClick={generatePrediction}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Regenerate Daily Model
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
                  Demand Forecast
                </CardTitle>
                <CardDescription>Projected performance for today</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                Model: Gemini 2.5 Flash
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
                    <span className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-bold">Demand Level</span>
                    <Badge className={cn(
                      "text-lg px-4 py-1",
                      prediction.predictedDemandLevel === 'Very High' ? 'bg-orange-500' :
                      prediction.predictedDemandLevel === 'High' ? 'bg-primary' : 'bg-emerald-500'
                    )}>
                      {prediction.predictedDemandLevel}
                    </Badge>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/30 flex flex-col items-center text-center">
                    <span className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-bold">Est. Covers</span>
                    <span className="text-3xl font-bold text-primary">{prediction.predictedCovers}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" /> STAFFING RECOMMENDATION
                    </h3>
                    <p className="bg-primary/5 p-4 rounded-lg border border-primary/10 leading-relaxed italic text-primary/80">
                      "{prediction.staffingRecommendation}"
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" /> AI REASONING
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {prediction.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Click button to generate today's forecast.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-lg">Inventory Impact</CardTitle>
          </CardHeader>
          <CardContent>
            {prediction ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <h4 className="text-sm font-bold text-accent-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Stock Priorities
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {prediction.inventoryNotes}
                  </p>
                </div>
                <div className="space-y-3">
                   <h4 className="text-xs font-bold text-muted-foreground uppercase">Historical Comparison</h4>
                   {[
                     { label: 'Similar Days', value: '+15%' },
                     { label: 'Last Week', value: '-2%' },
                     { label: 'Yearly Trend', value: '+22%' }
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
                <p className="text-xs">Awaiting daily model generation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}