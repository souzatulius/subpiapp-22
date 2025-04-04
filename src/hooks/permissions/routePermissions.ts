
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
    '/consultar-notas',
    '/settings/dashboard-management'
  ];

  // Rotas restritas a comunicação e gabinete
  const comunicacaoRoutes = [
    '/dashboard/comunicacao/cadastrar-release',
    '/dashboard/comunicacao/releases',
    '/cadastrar-release',
    '/releases'
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

  // Verificar se é uma rota restrita a comunicação/gabinete
  const isComunicacaoRoute = comunicacaoRoutes.some(comRoute =>
    route === comRoute || route.startsWith(`${comRoute}/`)
  );

  if (isComunicacaoRoute) {
    // Aqui precisaríamos verificar se o usuário é da coordenação de comunicação ou gabinete
    // Como não temos acesso direto a essa informação aqui, vamos usar a permissão de admin como proxy
    // Em uma implementação real, isso seria verificado através de roles ou permissões específicas
    console.log(`Rota ${route} é restrita para comunicação/gabinete. Verificando permissões.`);
    return isAdmin; // temporário, deveria verificar a coordenação do usuário
  }

  // Por padrão, liberar outras rotas
  console.log(`Rota ${route} não é restrita. Acesso liberado.`);
  return true;
};
