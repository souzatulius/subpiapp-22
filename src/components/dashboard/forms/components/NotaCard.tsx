
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, FileText } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NotaOficial } from '@/types/nota';

interface NotaCardProps {
  nota: NotaOficial;
  isSelected: boolean;
  onClick: () => void;
}

const NotaCard: React.FC<NotaCardProps> = ({ nota, isSelected, onClick }) => {
  const formatRelativeTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true,
        locale: ptBR 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data desconhecida';
    }
  };

  return (
    <Card 
      key={nota.id} 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-2 border-[#003570]' : 'border border-gray-200'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-medium text-[#003570] mb-2">{nota.titulo}</h3>
            
            <div className="space-y-1.5">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                <span>{nota.autor?.nome_completo || 'Autor desconhecido'}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                <span>{nota.supervisao_tecnica?.descricao || 'Área não informada'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end justify-start">
            <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
              Pendente
            </div>
            
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <time dateTime={nota.criado_em} title={
                nota.criado_em ? format(
                  new Date(nota.criado_em), 
                  "dd/MM/yyyy 'às' HH:mm", 
                  { locale: ptBR }
                ) : ''
              }>
                {nota.criado_em ? formatRelativeTime(nota.criado_em) : 'Data desconhecida'}
              </time>
            </div>
          </div>
        </div>
        
        {nota.texto && (
          <div className="mt-3 text-sm text-gray-600 line-clamp-2">
            {nota.texto}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotaCard;
