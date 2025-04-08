
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ESICProcesso, statusLabels, situacaoLabels } from '@/types/esic';
import { FileText, Pencil, Trash2 } from 'lucide-react';

interface ProcessoItemProps {
  processo: ESICProcesso;
  onSelect: (processo: ESICProcesso) => void;
  onEdit: (processo: ESICProcesso) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'novo_processo':
      return 'bg-blue-100 text-blue-800';
    case 'aguardando_justificativa':
      return 'bg-yellow-100 text-yellow-800';
    case 'aguardando_aprovacao':
      return 'bg-purple-100 text-purple-800';
    case 'concluido':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSituacaoColor = (situacao: string) => {
  switch (situacao) {
    case 'em_tramitacao':
      return 'bg-orange-100 text-orange-800';
    case 'prazo_prorrogado':
      return 'bg-red-100 text-red-800';
    case 'concluido':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ProcessoItem: React.FC<ProcessoItemProps> = ({ 
  processo, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <CardTitle className="text-lg">
              Processo de {format(new Date(processo.data_processo), "dd/MM/yyyy", { locale: ptBR })}
            </CardTitle>
            <CardDescription>
              Criado por: {processo.autor?.nome_completo || 'Usuário'} em {' '}
              {format(new Date(processo.criado_em), "dd/MM/yyyy", { locale: ptBR })}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(processo.status)}>
              {statusLabels[processo.status]}
            </Badge>
            <Badge className={getSituacaoColor(processo.situacao)}>
              {situacaoLabels[processo.situacao]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 line-clamp-3">{processo.texto}</p>
      </CardContent>
      <CardFooter className="pt-0 flex flex-wrap justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onSelect(processo)}
          className="sm:flex"
        >
          <FileText className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Detalhes</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(processo)}
          className="sm:flex"
        >
          <Pencil className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Editar</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:bg-red-50 sm:flex"
          onClick={() => onDelete(processo.id)}
        >
          <Trash2 className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Excluir</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProcessoItem;
