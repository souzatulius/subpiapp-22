
import { User } from './types';

export function prepareUsersDataForExport(users: User[]) {
    return users.map(user => ({
        'Nome': user.nome_completo || '',
        'Email': user.email || '',
        'Cargo': user.cargos?.descricao || '',
        'Supervisão Técnica': user.supervisao_tecnica?.descricao || '',
        'Coordenação': user.coordenacao?.descricao || '',
        'WhatsApp': user.whatsapp || '',
        'Aniversário': user.aniversario ? formatDate(user.aniversario) : '',
        'Status': user.permissoes && user.permissoes.length > 0 ? 'Ativo' : 'Inativo',
    }));
}

export function formatDate(dateString: string) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    } catch (error) {
        return dateString;
    }
}
