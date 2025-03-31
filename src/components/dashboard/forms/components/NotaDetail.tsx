
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

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Data desconhecida';
    try {
      return format(new Date(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  // Format time for display
  const formatTimeDisplay = (dateStr: string) => {
    if (!dateStr) return 'Horário desconhecido';
    try {
      return format(new Date(dateStr), "HH:mm", { locale: ptBR });
    } catch {
      return 'Horário inválido';
    }
  };

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
                  <span>{formatDateDisplay(dataCreated || "")}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-1">Horário:</span>
                  <span>{formatTimeDisplay(dataCreated || "")}</span>
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

        {nota.historico_edicoes && nota.historico_edicoes.length > 0 && (
          <div className="mt-6">
            <h4 className="text-base font-medium text-gray-700 mb-2">Histórico de Edições</h4>
            <Card className="p-4 border border-gray-200">
              <div className="space-y-3">
                {nota.historico_edicoes.map((edicao) => (
                  <div key={edicao.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{edicao.editor?.nome_completo || "Editor desconhecido"}</span>
                      <span className="text-xs text-gray-500">
                        {formatDateDisplay(edicao.criado_em)} às {formatTimeDisplay(edicao.criado_em)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Título alterado:</span> 
                        <span className="line-through text-gray-400 ml-1">{edicao.titulo_anterior}</span>
                        <span className="text-blue-600 ml-2">{edicao.titulo_novo}</span>
                      </div>
                      {edicao.texto_anterior !== edicao.texto_novo && (
                        <div>
                          <span className="font-medium">Texto editado</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
        
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
