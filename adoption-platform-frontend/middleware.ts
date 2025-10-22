import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * MIDDLEWARE DESACTIVADO TEMPORALMENTE
 * 
 * Este middleware se activará cuando se implemente el backend con autenticación JWT.
 * Por ahora, todas las rutas son accesibles sin restricción para facilitar el desarrollo.
 * 
 * Para activar: Descomenta el código de validación y activa el matcher
 */

export function middleware(request: NextRequest) {
  // Permitir acceso a todas las rutas sin autenticación
  return NextResponse.next()
}

// Matcher desactivado - no se ejecutará el middleware
export const config = {
  matcher: [],
}

/* 
// CÓDIGO ORIGINAL - Descomentar cuando se implemente auth
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  
  const publicPaths = ['/', '/login', '/register']
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }
  
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/animales') || 
      pathname.startsWith('/solicitudes') || 
      pathname.startsWith('/buscar-chip')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url))
    }
    return NextResponse.next()
  }
  
  if (pathname.startsWith('/adopt/') || pathname.startsWith('/submissions')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url))
    }
    return NextResponse.next()
  }
  
  return NextResponse.next()
}
*/
