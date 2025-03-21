
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Autor {
  nome_completo: string;
}

interface AreaCoordenacao {
  descricao: string;
}

export interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  criado_em: string;
  atualizado_em: string;
  autor: Autor;
  area_coordenacao: AreaCoordenacao;
}

interface NotasTableProps {
  notas: NotaOficial[];
  loading: boolean;
  formatDate: (dateString: string) => string;
}

const NotasTable: React.FC<NotasTableProps> = ({ notas, loading, formatDate }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-md p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" id="notas-table">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {notas.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                Nenhuma nota encontrada.
              </td>
            </tr>
          ) : (
            notas.map((nota) => (
              <tr key={nota.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{nota.titulo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{nota.autor.nome_completo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{nota.area_coordenacao.descricao}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${nota.status === 'aprovado' ? 'bg-green-100 text-green-800' : ''}
                    ${nota.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${nota.status === 'rascunho' ? 'bg-gray-100 text-gray-800' : ''}
                    ${nota.status === 'publicado' ? 'bg-blue-100 text-blue-800' : ''}
                    ${nota.status === 'rejeitado' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(nota.criado_em)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NotasTable;
