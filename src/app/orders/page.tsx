"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ClipboardList, 
  Plus, 
  Search, 
  ShoppingCart, 
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react'
import { aiDishRecommendation } from '@/ai/flows/ai-dish-recommendation'
import { POPULAR_DISHES } from '@/lib/mock-data'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'

export default function OrdersPage() {
  const [currentOrder, setCurrentOrder] = useState<string[]>([])
  const [loadingAi, setLoadingAi] = useState(false)
  const [recommendations, setRecommendations] = useState<{items: string[], reason: string} | null>(null)
  const { toast } = useToast()

  const addToOrder = (dish: string) => {
    setCurrentOrder(prev => [...prev, dish])
  }

  const getAiUpsell = async () => {
    if (currentOrder.length === 0) {
      toast({ title: "Order empty", description: "Add some items before getting recommendations." })
      return
    }
    setLoadingAi(true)
    try {
      const res = await aiDishRecommendation({
        orderedDishNames: currentOrder,
        popularItemsRecently: POPULAR_DISHES,
        occasionOrTime: "Dinner Service"
      })
      setRecommendations({
        items: res.recommendedDishes,
        reason: res.reasoning
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingAi(false)
    }
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Order Management</h1>
        <p className="text-muted-foreground">Process orders and enhance guest experience with AI recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Menu & Search */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Menu Browser</CardTitle>
                <div className="relative w-48">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Find dish..." className="pl-8 h-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {POPULAR_DISHES.map((dish) => (
                  <Button 
                    key={dish} 
                    variant="outline" 
                    className="justify-between h-auto py-4 px-4 hover:bg-primary hover:text-white transition-colors group"
                    onClick={() => addToOrder(dish)}
                  >
                    <span className="font-medium">{dish}</span>
                    <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {recommendations && (
            <Card className="bg-accent/10 border-accent/30 overflow-hidden">
              <div className="p-1 bg-accent flex items-center justify-center gap-2">
                 <Sparkles className="h-3 w-3 text-white" />
                 <span className="text-[10px] font-bold text-white uppercase tracking-widest">AI Upsell Assistant</span>
              </div>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  Recommended Add-ons
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {recommendations.items.map(rec => (
                      <Button 
                        key={rec} 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white border-accent/20 hover:bg-accent hover:text-white"
                        onClick={() => {
                          addToOrder(rec)
                          setRecommendations(null)
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" /> {rec}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm italic text-muted-foreground leading-relaxed border-l-2 border-accent pl-4">
                    "{recommendations.reason}"
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Current Order Cart */}
        <Card className="lg:col-span-5 h-fit shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Active Basket
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="min-h-[200px] space-y-3">
              {currentOrder.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                  <ClipboardList className="h-12 w-12 mb-2" />
                  <p>No items selected</p>
                </div>
              ) : (
                currentOrder.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b last:border-0 group">
                    <span className="font-medium">{item}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive h-7 px-2 opacity-0 group-hover:opacity-100"
                      onClick={() => setCurrentOrder(prev => prev.filter((_, idx) => idx !== i))}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Estimated Total</span>
                <span>${(currentOrder.length * 15).toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  onClick={getAiUpsell}
                  disabled={loadingAi || currentOrder.length === 0}
                >
                  <Sparkles className={cn("h-4 w-4 text-accent", loadingAi && "animate-spin")} />
                  AI Upsell
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  Send to Kitchen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}