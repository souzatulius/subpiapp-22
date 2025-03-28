
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle, User, Calendar, Clock, FileText, Edit, Building } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NotaOficial } from '@/types/nota';
import DemandHistorySection from './DemandHistorySection';

interface NotaDetailProps {
  nota: NotaOficial;
  onBack: () => void;
  onAprovar: () => void;
  onRejeitar: () => void;
  onEditar: () => void;
  isSubmitting: boolean;
}

const NotaDetail: React.FC<NotaDetailProps> = ({ 
  nota, 
  onBack, 
  onAprovar, 
  onRejeitar,
  onEditar,
  isSubmitting 
}) => {
  // Use either criado_em or created_at, whichever is available
  const dataCreated = nota.criado_em || nota.created_at;
  const temDemanda = !!(nota.demanda_id || nota.demanda?.id);
  
  // Get coordination name from the problem
  const coordenacao = nota.problema?.coordenacao?.descricao || 'Não informada';

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
          <h3 className="text-xl font-medium text-[#003570]">{nota.titulo}</h3>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-gray-50 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Informações da Nota</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-1">Autor:</span>
                  <span>{nota.autor?.nome_completo || 'Autor desconhecido'}</span>
                </div>
                
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-1">Coordenação:</span>
                  <span>{coordenacao}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-1">Data:</span>
                  <span>{dataCreated ? format(
                    new Date(dataCreated), 
                    "dd 'de' MMMM 'de' yyyy", 
                    { locale: ptBR }
                  ) : 'Data desconhecida'}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-1">Horário:</span>
                  <span>{dataCreated ? format(
                    new Date(dataCreated), 
                    "HH:mm", 
                    { locale: ptBR }
                  ) : 'Horário desconhecido'}</span>
                </div>
              </div>
            </Card>
            
            {temDemanda ? (
              <DemandHistorySection 
                demandaId={nota.demanda_id || nota.demanda?.id || ''} 
                notaId={nota.id}
                notaCreatedAt={nota.criado_em}
              />
            ) : (
              <Card className="p-4 bg-gray-50 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Não vinculada à demanda</h4>
                <p className="text-sm text-gray-600">
                  Esta nota oficial não está associada a uma demanda específica.
                </p>
              </Card>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-base font-medium text-gray-700 mb-2">Conteúdo da Nota</h4>
          <Card className="p-4 border border-gray-200">
            <div className="text-sm whitespace-pre-line leading-relaxed">{nota.texto}</div>
          </Card>
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
            variant="outline"
            onClick={onEditar}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <Edit className="h-4 w-4 mr-2 text-blue-500" />
            Editar
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
