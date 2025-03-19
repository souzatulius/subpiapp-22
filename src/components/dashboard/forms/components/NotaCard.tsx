
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NotaOficial } from '../types';

interface NotaCardProps {
  nota: NotaOficial;
  isSelected: boolean;
  onClick: () => void;
}

const NotaCard: React.FC<NotaCardProps> = ({ nota, isSelected, onClick }) => {
  return (
    <Card 
      key={nota.id} 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-2 border-[#003570]' : 'border border-gray-200'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h3 className="font-medium mb-2">{nota.titulo}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <User className="h-3 w-3 mr-1" />
          <span>{nota.autor?.nome_completo || 'Autor desconhecido'}</span>
        </div>
        
        <div className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Área:</span>{' '}
          {nota.areas_coordenacao?.descricao || 'Não informada'}
        </div>
        
        <div className="text-sm text-gray-500">
          <span className="font-medium">Criada em:</span>{' '}
          {nota.criado_em ? format(
            new Date(nota.criado_em), 
            "dd/MM/yyyy 'às' HH:mm", 
            { locale: ptBR }
          ) : 'Data desconhecida'}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotaCard;
