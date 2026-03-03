
"use client"

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useUser } from '@/firebase'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register'

  React.useEffect(() => {
    if (!isUserLoading && !user && !isAuthPage) {
      router.push('/login')
    }
    if (!isUserLoading && user && isAuthPage) {
      router.push('/')
    }
  }, [user, isUserLoading, pathname, router, isAuthPage])

  if (isUserLoading && !isAuthPage) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
