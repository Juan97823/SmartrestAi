
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // En un prototipo usamos una cookie o localStorage simulado
  // Nota: middleware corre en Edge, no tiene acceso a localStorage real del cliente directamente
  // Para este ejemplo, permitimos el acceso pero recomendamos Auth Guards en componentes
  
  const path = request.nextUrl.pathname

  if (path === '/login') {
    return NextResponse.next()
  }

  // Aquí iría la validación real de token de sesión
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
