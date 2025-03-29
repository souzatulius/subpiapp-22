/**
 * Funções utilitárias para checar permissões de rota
 */

/**
 * Verifica se o usuário pode acessar uma rota protegida
 */
export const canAccessProtectedRoute = (route: string, isAdmin: boolean): boolean => {
  // Admin pode tudo
  if (isAdmin) {
    console.log(`Usuário é admin, acesso liberado à rota: ${route}`);
    return true;
  }

  // Rota base do dashboard deve ser liberada para todos os usuários autenticados
  const publicRoutes = ['/dashboard'];

  // Rotas restritas a admins
  const adminOnlyRoutes = [
    '/dashboard/comunicacao/cadastrar-demanda',
    '/dashboard/comunicacao/consultar-demandas',
    '/dashboard/comunicacao/criar-nota-oficial',
    '/dashboard/comunicacao/consultar-notas',
    '/cadastrar-demanda',
    '/consultar-demandas',
    '/criar-nota-oficial',
    '/consultar-notas'
  ];

  // Permitir rotas públicas
  if (publicRoutes.includes(route)) {
    console.log(`Rota pública: ${route}, acesso liberado`);
    return true;
  }

  // Se a rota for admin-only, negar acesso
  const isAdminOnly = adminOnlyRoutes.some(adminRoute =>
    route === adminRoute || route.startsWith(`${adminRoute}/`)
  );

  if (isAdminOnly) {
    console.log(`Rota ${route} é restrita para admins. Acesso negado.`);
    return false;
  }

  // Por padrão, liberar outras rotas
  console.log(`Rota ${route} não é restrita. Acesso liberado.`);
  return true;
};
