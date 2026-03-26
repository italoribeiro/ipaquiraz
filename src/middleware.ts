// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // Aqui definimos o usuário e senha provisórios
    if (user === 'italo' && pwd === 'admin123') {
      return NextResponse.next(); // Liberado!
    }
  }

  // Se não tem senha ou tá errada, bloqueia e pede
  return new NextResponse('Acesso Negado. Autenticação Necessária.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Painel Administrativo - IP Aquiraz"',
    },
  });
}

// Essa linha garante que o bloqueio SÓ aconteça na pasta /admin e suas subpáginas
export const config = {
  matcher: ['/admin/:path*'],
};