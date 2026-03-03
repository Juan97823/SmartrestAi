"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, MessageSquare, Bot, User, Loader2 } from 'lucide-react'
import { customerSupportChatbot } from '@/ai/flows/customer-support-chatbot-flow'
import { cn } from '@/lib/utils'

type Message = {
  role: 'bot' | 'user'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "¡Hola! Soy el asistente de SmartRest AI. ¿En qué puedo ayudarte hoy?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const response = await customerSupportChatbot({ query: userMsg })
      setMessages(prev => [...prev, { role: 'bot', content: response }])
    } catch (err) {
      console.error("Error en Chatbot:", err)
      setMessages(prev => [...prev, { role: 'bot', content: "Lo siento, tuve un problema interno al procesar tu solicitud. Por favor, intenta de nuevo." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Asistente de Inteligencia Artificial</h1>
        <p className="text-muted-foreground">Soporte interno especializado en operaciones, menús y políticas de SmartRest.</p>
      </div>

      <Card className="flex-1 flex flex-col shadow-2xl overflow-hidden border-none rounded-2xl">
        <CardHeader className="bg-primary text-primary-foreground py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5" />
            SmartRest AI - Asistente Virtual
          </CardTitle>
        </CardHeader>
        
        <CardContent 
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50"
          ref={scrollRef}
        >
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={cn(
                "flex items-start gap-3",
                msg.role === 'user' ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-md",
                msg.role === 'bot' ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
              )}>
                {msg.role === 'bot' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>
              <div className={cn(
                "max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed",
                msg.role === 'bot' 
                  ? "bg-white text-foreground rounded-tl-none border border-slate-200" 
                  : "bg-primary text-primary-foreground rounded-tr-none"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-accent-foreground shadow-md">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2 shadow-sm">
                <Loader2 className="h-3 w-3 animate-spin text-accent" />
                <span className="text-xs text-muted-foreground italic">Consultando al motor de IA...</span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 bg-white border-t">
          <form 
            className="flex w-full gap-3"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <Input 
              placeholder="¿Cuál es el menú del día? o ¿Cómo va el inventario?" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-50 border-slate-200 focus:ring-accent"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()} className="bg-primary hover:bg-primary/90 px-6">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
