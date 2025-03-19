
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NotaOficial } from '../types';

interface NotaDetailProps {
  nota: NotaOficial;
  onBack: () => void;
  onAprovar: () => void;
  onRejeitar: () => void;
  isSubmitting: boolean;
}

const NotaDetail: React.FC<NotaDetailProps> = ({ 
  nota, 
  onBack, 
  onAprovar, 
  onRejeitar, 
  isSubmitting 
}) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="p-1.5"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        
        <div className="mt-4">
          <h3 className="text-xl font-medium">{nota.titulo}</h3>
          
          <div className="mt-2 text-sm text-gray-500">
            <div className="flex items-center mb-1">
              <User className="h-4 w-4 mr-1" />
              <span>{nota.autor?.nome_completo || 'Autor desconhecido'}</span>
            </div>
            
            <div className="mb-1">
              <span className="font-medium">Área:</span>{' '}
              {nota.areas_coordenacao?.descricao || 'Não informada'}
            </div>
            
            <div>
              <span className="font-medium">Criada em:</span>{' '}
              {nota.criado_em ? format(
                new Date(nota.criado_em), 
                "dd/MM/yyyy 'às' HH:mm", 
                { locale: ptBR }
              ) : 'Data desconhecida'}
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-4">
          <div className="text-sm whitespace-pre-line">{nota.texto}</div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <Button 
            variant="outline"
            onClick={onRejeitar}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <XCircle className="h-4 w-4 mr-2 text-red-500" />
            Rejeitar
          </Button>
          
          <Button 
            onClick={onAprovar}
            disabled={isSubmitting}
            className="bg-[#003570] hover:bg-[#002855] flex items-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Aprovar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotaDetail;
