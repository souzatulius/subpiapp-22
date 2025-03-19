
import { format } from 'date-fns';
import { User } from './types';

export const handleExportCsv = (filteredUsers: User[]) => {
  const headers = ['Nome', 'Email', 'Cargo', 'Área de Coordenação', 'WhatsApp', 'Aniversário'];
  const csvData = filteredUsers.map(user => [
    user.nome_completo,
    user.email,
    user.cargos?.descricao || '',
    user.areas_coordenacao?.descricao || '',
    user.whatsapp || '',
    user.aniversario ? format(new Date(user.aniversario), 'dd/MM/yyyy') : ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => {
      if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'usuarios.csv';
  link.click();
  URL.revokeObjectURL(link.href);
};

export const handlePrint = () => {
  window.print();
};
