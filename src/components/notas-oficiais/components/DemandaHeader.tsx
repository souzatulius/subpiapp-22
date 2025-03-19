
import React from 'react';
import { ChevronLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Demanda } from '../types';

interface DemandaHeaderProps {
  demanda: Demanda;
  onClose: () => void;
}

const DemandaHeader: React.FC<DemandaHeaderProps> = ({ demanda, onClose }) => {
  const formattedDate = demanda.horario_publicacao 
    ? format(new Date(demanda.horario_publicacao), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
    : 'Data não disponível';
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex gap-3">
          <Badge variant="outline" className="bg-slate-100">
            {demanda.areas_coordenacao?.descricao || 'Sem área definida'}
          </Badge>
          <Badge variant="outline" className={
            demanda.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
            demanda.status === 'concluído' ? 'bg-green-100 text-green-800' : 
            'bg-blue-100 text-blue-800'
          }>
            {demanda.status}
          </Badge>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold">{demanda.titulo}</h2>
      
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Clock className="h-4 w-4" />
        <span>{formattedDate}</span>
      </div>
      
      <Separator />
    </div>
  );
};

export default DemandaHeader;
