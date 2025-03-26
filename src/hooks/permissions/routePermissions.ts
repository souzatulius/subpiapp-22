
/**
 * Utility functions for checking route access permissions
 */

/**
 * Checks if user can access a protected route
 */
export const canAccessProtectedRoute = (route: string, isAdmin: boolean): boolean => {
  // Admin can access all routes
  if (isAdmin) {
    console.log(`User has admin status, allowing access to route: ${route}`);
    return true;
  }
  
  // Protected routes that only admins can access
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
  
  // Removemos '/settings' da lista de rotas administrativas
  
  // Check if the route starts with any of the admin-only routes
  const isAdminRoute = adminOnlyRoutes.some(adminRoute => 
    route === adminRoute || 
    route.startsWith(`${adminRoute}/`)
  );
  
  const canAccess = !isAdminRoute;
  console.log(`Route "${route}" is ${isAdminRoute ? 'admin-only' : 'accessible to all'}, access granted: ${canAccess}`);
  return canAccess;
};
