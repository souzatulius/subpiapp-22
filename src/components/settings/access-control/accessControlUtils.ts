
import { User, Permission } from './types';

// Filter users by search term
export const filterUsers = (users: User[], filter: string): User[] => {
  if (!filter.trim()) return users;
  
  const searchTerm = filter.toLowerCase();
  
  return users.filter(user => 
    user.nome_completo.toLowerCase().includes(searchTerm) ||
    (user.email && user.email.toLowerCase().includes(searchTerm)) ||
    (user.whatsapp && user.whatsapp.toLowerCase().includes(searchTerm))
  );
};

// Export user permissions to CSV
export const exportToCsv = (
  users: User[], 
  permissions: Permission[],
  userPermissions: Record<string, string[]>
) => {
  // Create CSV header
  const headers = ['Nome', 'Email', 'WhatsApp', 'Aniversário', 'Permissões'];
  
  // Create CSV rows
  const rows = users.map(user => {
    const userPerms = userPermissions[user.id] || [];
    const permissionsText = permissions
      .filter(p => userPerms.includes(p.id))
      .map(p => p.name)
      .join(', ');
    
    return [
      user.nome_completo,
      user.email,
      user.whatsapp || '',
      user.aniversario || '',
      permissionsText
    ];
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'user_permissions.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Format and print access control table
export const printAccessControl = () => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Por favor, permita popups para imprimir.');
    return;
  }
  
  const tableElement = document.querySelector('.rounded-md.border.overflow-hidden');
  
  if (!tableElement) {
    alert('Não foi possível encontrar a tabela para imprimir.');
    printWindow.close();
    return;
  }
  
  const style = `
    <style>
      body { font-family: system, -apple-system, sans-serif; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f3f4f6; }
      h1 { color: #1e40af; }
      .print-header { margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
      }
    </style>
  `;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Controle de Acesso - Permissões de Usuários</title>
      ${style}
    </head>
    <body>
      <div class="print-header">
        <h1>Controle de Acesso - Permissões de Usuários</h1>
        <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
      </div>
      ${tableElement.outerHTML}
    </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // Wait for the content to load, then print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
