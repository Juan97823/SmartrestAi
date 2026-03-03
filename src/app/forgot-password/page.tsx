
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { UtensilsCrossed, Loader2, Mail, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Esta es la función real de Firebase que dispara el correo
      await sendPasswordResetEmail(auth, email)
      toast({ 
        title: "Correo enviado", 
        description: "Si el correo está registrado, recibirás un enlace en unos minutos. Revisa también tu carpeta de Spam." 
      })
      setEmail('')
    } catch (err: any) {
      console.error("Error al enviar correo:", err)
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "No se pudo procesar la solicitud. Verifica la conexión o intenta más tarde." 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl mb-4 rotate-3">
            <UtensilsCrossed className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">SmartRest AI</h1>
          <p className="text-muted-foreground">Recuperación de Acceso Real</p>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">¿Olvidaste tu contraseña?</CardTitle>
            <CardDescription>
              Firebase enviará un enlace de restablecimiento al correo que indiques si existe en la base de datos.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico Registrado</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="ejemplo@correo.com" 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Enviar Correo de Recuperación
              </Button>
              <Link 
                href="/login" 
                className="text-sm font-medium text-primary flex items-center gap-2 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio de sesión
              </Link>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700">
            <strong>Nota de Arquitecto:</strong> Si no recibes el correo, verifica en tu Consola de Firebase que el proveedor "Email/Password" esté activo y que el correo ingresado esté en la lista de usuarios.
          </p>
        </div>
      </div>
    </div>
  )
}
