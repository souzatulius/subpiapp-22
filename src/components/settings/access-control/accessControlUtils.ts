
import { User, Permission } from './types';

export const filterUsers = (users: User[], filter: string) => {
  return users.filter(user => {
    const searchTerms = filter.toLowerCase();
    return (
      user.nome_completo?.toLowerCase().includes(searchTerms) ||
      user.email?.toLowerCase().includes(searchTerms)
    );
  });
};

export const exportToCsv = (users: User[], permissions: Permission[], userPermissions: Record<string, string[]>) => {
  // Create CSV data
  const headers = ['Nome', 'Email', 'WhatsApp', 'Aniversário', 'Permissões'];
  const csvData = users.map(user => {
    const userPerms = userPermissions[user.id] || [];
    const permissionNames = userPerms
      .map(permId => {
        const perm = permissions.find(p => p.id === permId);
        return perm ? `${perm.descricao} (Nível: ${perm.nivel_acesso})` : '';
      })
      .filter(Boolean)
      .join('; ');
    
    return [
      user.nome_completo,
      user.email,
      user.whatsapp || '-',
      user.aniversario || '-',
      permissionNames
    ];
  });
  
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => {
      // Handle commas and quotes in CSV
      if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(','))
  ].join('\n');
  
  // Download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'controle_acesso.csv';
  link.click();
  URL.revokeObjectURL(link.href);
};

export const printAccessControl = () => {
  window.print();
};
