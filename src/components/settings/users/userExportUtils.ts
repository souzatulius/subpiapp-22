
import { User } from '@/types/common';
import { formatDate } from '@/lib/utils';

export const formatUserDataForExport = (users: User[]) => {
  return users.map(user => ({
    'Nome': user.nome_completo,
    'Email': user.email,
    'Telefone (WhatsApp)': user.whatsapp || 'Não informado',
    'Data de Nascimento': user.aniversario ? formatDate(user.aniversario) : 'Não informado',
    'Cargo': user.cargos?.descricao || 'Não definido',
    'Coordenação': user.coordenacao?.descricao || 'Não definido',
    'Supervisão Técnica': user.supervisao_tecnica?.descricao || 'Não definido',
    'Data de Cadastro': user.criado_em ? formatDate(user.criado_em) : 'Não informado',
    'Status': user.permissoes && user.permissoes.length > 0 ? 'Ativo' : 'Pendente'
  }));
};

export function downloadCsv(data: any[], filename: string) {
  // Obter os cabeçalhos do primeiro objeto
  const headers = Object.keys(data[0]);
  
  // Criar o conteúdo do CSV
  let csvContent = headers.join(',') + '\n';
  
  // Adicionar linhas de dados
  data.forEach(item => {
    const row = headers.map(header => {
      // Obter o valor e garantir que esteja formatado adequadamente para CSV
      let cellValue = item[header] === null ? '' : String(item[header]);
      
      // Escapar aspas duplas no texto e envolver o texto em aspas se contiver vírgulas ou novas linhas
      if (cellValue.includes('"')) {
        cellValue = cellValue.replace(/"/g, '""');
      }
      
      if (cellValue.includes(',') || cellValue.includes('\n') || cellValue.includes('"')) {
        cellValue = `"${cellValue}"`;
      }
      
      return cellValue;
    }).join(',');
    
    csvContent += row + '\n';
  });
  
  // Criar o blob e download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
