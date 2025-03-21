
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { AlertCircle, Clock, CheckCircle2, Archive, XCircle, FileText, Clock3, FileCheck } from 'lucide-react';

interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  area_coordenacao: { descricao: string } | null;
  servico: { descricao: string } | null;
  origem: { descricao: string } | null;
  tipo_midia: { descricao: string } | null;
  bairro: { nome: string } | null;
  autor: { nome_completo: string } | null;
  endereco: string | null;
  nome_solicitante: string | null;
  email_solicitante: string | null;
  telefone_solicitante: string | null;
  veiculo_imprensa: string | null;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null;
}

interface DemandListProps {
  demandas: Demand[];
  isLoading: boolean;
  onSelectDemand: (demand: Demand) => void;
}

const DemandList: React.FC<DemandListProps> = ({ demandas, isLoading, onSelectDemand }) => {
  // Helper function to get status icon - updated with new status icons
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'em_andamento':
        return <Clock3 className="h-4 w-4 text-blue-500" />;
      case 'respondida':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'aguardando_nota':
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      case 'nota_criada':
        return <FileText className="h-4 w-4 text-indigo-500" />;
      case 'pendente_aprovacao':
        return <FileCheck className="h-4 w-4 text-orange-500" />;
      case 'aprovada':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'editada':
        return <FileText className="h-4 w-4 text-cyan-500" />;
      case 'recusada':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'arquivada':
        return <Archive className="h-4 w-4 text-gray-500" />;
      case 'cancelada':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Helper function to get status text - updated with new status text
  const formatStatus = (status: string) => {
    switch (status) {
      case 'pendente': return 'Nova';
      case 'em_andamento': return 'Aguardando Respostas';
      case 'respondida': return 'Respondida';
      case 'aguardando_nota': return 'Aguardando Nota';
      case 'nota_criada': return 'Nota Criada';
      case 'pendente_aprovacao': return 'Pendente de Aprovação';
      case 'aprovada': return 'Aprovada';
      case 'editada': return 'Editada';
      case 'recusada': return 'Recusada';
      case 'arquivada': return 'Arquivada';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  // Helper function to get priority badge color
  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function to format priority text
  const formatPriority = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return prioridade;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Título</TableHead>
              <TableHead className="font-semibold">Área</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Prioridade</TableHead>
              <TableHead className="font-semibold">Criado em</TableHead>
              <TableHead className="font-semibold">Prazo</TableHead>
              <TableHead className="font-semibold">Responsável</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell><div className="h-4 bg-gray-200 rounded w-3/4"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded w-1/2"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded w-20"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded w-16"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded w-24"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded w-24"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded w-32"></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (demandas.length === 0) {
    return (
      <div className="text-center p-12 border border-dashed rounded-lg">
        <h3 className="text-lg font-medium mb-2">Nenhuma demanda encontrada</h3>
        <p className="text-gray-500">Não há demandas com os filtros selecionados.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold text-[#003570]">Título</TableHead>
            <TableHead className="font-semibold text-[#003570]">Área</TableHead>
            <TableHead className="font-semibold text-[#003570]">Status</TableHead>
            <TableHead className="font-semibold text-[#003570]">Prioridade</TableHead>
            <TableHead className="font-semibold text-[#003570]">Criado em</TableHead>
            <TableHead className="font-semibold text-[#003570]">Prazo</TableHead>
            <TableHead className="font-semibold text-[#003570]">Responsável</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demandas.map((demanda) => (
            <TableRow 
              key={demanda.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectDemand(demanda)}
            >
              <TableCell className="font-medium">{demanda.titulo}</TableCell>
              <TableCell>{demanda.area_coordenacao?.descricao}</TableCell>
              <TableCell>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getStatusIcon(demanda.status)}
                  {formatStatus(demanda.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getPriorityColor(demanda.prioridade)}`}>
                  {formatPriority(demanda.prioridade)}
                </Badge>
              </TableCell>
              <TableCell>
                {demanda.horario_publicacao ? 
                  format(new Date(demanda.horario_publicacao), 'dd/MM/yyyy', { locale: ptBR }) : 
                  'N/A'
                }
              </TableCell>
              <TableCell>
                {demanda.prazo_resposta ? 
                  format(new Date(demanda.prazo_resposta), 'dd/MM/yyyy', { locale: ptBR }) : 
                  'N/A'
                }
              </TableCell>
              <TableCell>{demanda.autor?.nome_completo || 'Não atribuído'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DemandList;
