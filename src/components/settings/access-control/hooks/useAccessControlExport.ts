
import { User, Permission } from '../types';

export const useAccessControlExport = (
  users: User[],
  permissions: Permission[],
  userPermissions: Record<string, string[]>
) => {
  const handleExportCsv = () => {
    // Create CSV headers
    const headers = ['ID', 'Nome', 'Tipo', ...permissions.map(p => p.name)];
    
    // Create CSV rows
    const rows = users.map(user => {
      const userPerms = userPermissions[user.id] || [];
      
      return [
        user.id,
        user.nome_completo,
        user.supervisao_tecnica_id ? 'Supervisão Técnica' : 'Coordenação',
        ...permissions.map(p => userPerms.includes(p.id) ? 'Sim' : 'Não')
      ];
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'permissoes_acesso.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return { handleExportCsv, handlePrint };
};
