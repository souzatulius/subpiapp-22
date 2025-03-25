
import { User } from '@/types/common';
import { formatDate } from '@/types/common';

export const prepareUserDataForExport = (users: User[]) => {
  return users.map(user => ({
    'Nome': user.nome_completo || '',
    'Email': user.email || '',
    'Telefone': user.whatsapp || '',
    'Cargo': user.cargos?.descricao || '',
    'Supervisão Técnica': user.supervisao_tecnica?.descricao || '',
    'Coordenação': user.coordenacao?.descricao || '',
    'Data de Cadastro': user.criado_em ? formatDate(user.criado_em) : '',
    'Status': (user.permissoes && user.permissoes.length > 0) ? 'Ativo' : 'Pendente',
  }));
};
