
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
import { Demand } from '@/types/demand';
import { DemandaStatusBadge } from '@/components/ui/status-badge';
import { formatPriority, getPriorityColor } from '@/utils/priorityUtils';

interface DemandListProps {
  demandas: Demand[];
  isLoading: boolean;
  onSelectDemand: (demand: Demand) => void;
}

const DemandList: React.FC<DemandListProps> = ({ demandas, isLoading, onSelectDemand }) => {
  // Helper function to get priority badge color
  const getPriorityBadgeClasses = (prioridade: string) => {
    const colors = getPriorityColor(prioridade);
    return `${colors.bg} ${colors.text} border ${colors.border}`;
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
                <DemandaStatusBadge status={demanda.status} size="sm" />
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getPriorityBadgeClasses(demanda.prioridade)}>
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
