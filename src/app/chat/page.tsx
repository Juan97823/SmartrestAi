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
      console.error(err)
      setMessages(prev => [...prev, { role: 'bot', content: "Lo siento, tengo problemas para conectarme en este momento." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">Asistente de Soporte</h1>
        <p className="text-muted-foreground">Bot interno entrenado en menús, horarios y políticas del restaurante.</p>
      </div>

      <Card className="flex-1 flex flex-col shadow-2xl overflow-hidden border-none">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            SmartRest AI Bot
          </CardTitle>
        </CardHeader>
        
        <CardContent 
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8fafc]"
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
                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'bot' ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
              )}>
                {msg.role === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={cn(
                "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                msg.role === 'bot' 
                  ? "bg-white text-foreground rounded-tl-none border" 
                  : "bg-primary text-primary-foreground rounded-tr-none"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-accent" />
                <span className="text-xs text-muted-foreground italic">El bot está pensando...</span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 bg-white border-t">
          <form 
            className="flex w-full gap-2"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <Input 
              placeholder="Escribe tu pregunta aquí..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading} size="icon" className="bg-primary">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
