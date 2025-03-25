
import * as XLSX from 'xlsx';
import { User } from '@/types/common';
import { formatDate } from '@/types/common';

export const exportUsersToExcel = (users: User[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    users.map(user => ({
      Nome: user.nome_completo,
      Email: user.email,
      Cargo: user.cargos?.descricao || 'Não definido',
      'Supervisão Técnica': user.supervisao_tecnica?.descricao || 'Não definida',
      'Data de Cadastro': user.criado_em ? formatDate(user.criado_em) : 'N/A',
      Status: user.permissoes && user.permissoes.length > 0 ? 'Ativo' : 'Pendente'
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuários');
  
  XLSX.writeFile(workbook, 'usuarios_subpi.xlsx');
};
