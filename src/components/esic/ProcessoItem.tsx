
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Processo {
  id: number | string;
  numero_processo: string;
  titulo: string;
  categoria?: string;
  status: string;
  created_at: string;
  prazo?: string;
  solicitante: string;
}

export interface ProcessoItemProps {
  processo: Processo;
  onDeleteClick: () => void;
}

const ProcessoItem: React.FC<ProcessoItemProps> = ({ processo, onDeleteClick }) => {
  const navigate = useNavigate();
  
  const handleViewClick = () => {
    navigate(`/esic/view/${processo.id}`);
  };
  
  const handleEditClick = () => {
    navigate(`/esic/edit/${processo.id}`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em análise':
        return 'bg-blue-100 text-blue-800';
      case 'Concluído':
        return 'bg-green-100 text-green-800';
      case 'Aguardando complemento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Negado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const isPrazoExpired = processo.prazo ? isPast(new Date(processo.prazo)) : false;
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="font-medium text-gray-900">{processo.titulo}</div>
          <div className="text-sm text-gray-500">
            {processo.numero_processo}
            {processo.categoria && (
              <span className="ml-2 text-gray-400">• {processo.categoria}</span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{processo.solicitante}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${getStatusColor(processo.status)}`}>
          {processo.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center">
          {isPrazoExpired && processo.status !== 'Concluído' && (
            <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
          )}
          {processo.prazo 
            ? format(new Date(processo.prazo), 'dd/MM/yyyy', { locale: ptBR })
            : 'Não definido'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
            onClick={handleViewClick}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
            onClick={handleEditClick}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
            onClick={onDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ProcessoItem;
