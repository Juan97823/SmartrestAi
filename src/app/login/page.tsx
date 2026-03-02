
"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { UtensilsCrossed, Loader2, Lock, Mail } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulación de login para prototipo
    setTimeout(() => {
      if (email === 'admin@smartrest.ai' && password === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true')
        window.location.href = '/' // Forzar recarga para actualizar layout
        toast({ title: "Bienvenido", description: "Acceso concedido a SmartRest AI." })
      } else {
        toast({ 
          variant: "destructive", 
          title: "Error de acceso", 
          description: "Credenciales inválidas. Use admin@smartrest.ai / admin123" 
        })
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl mb-4 rotate-3">
            <UtensilsCrossed className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">SmartRest AI</h1>
          <p className="text-muted-foreground">Gestión Inteligente de Restaurantes</p>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>Ingrese sus credenciales para acceder al panel ejecutivo.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@smartrest.ai" 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Entrar al Sistema
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                ¿Olvidó su contraseña? Contacte con soporte técnico.
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
