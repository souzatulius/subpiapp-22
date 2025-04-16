
import React from 'react';
import { Button } from '@/components/ui/button';
import { ValidationError, hasFieldError } from '@/lib/formValidationUtils';
import { Pencil } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  problemas: any[];
  origens: any[];
  tiposMidia: any[];
  filteredBairros: any[];
  distritos: any[];
  servicos: any[];
  errors: ValidationError[];
  showValidationErrors?: boolean;
  onNavigateToStep?: (step: number) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  problemas,
  origens,
  tiposMidia,
  filteredBairros,
  distritos,
  servicos,
  errors,
  showValidationErrors = false,
  onNavigateToStep
}) => {
  // Get lookups
  const origem = origens.find(o => o.id === formData.origem_id);
  const tipoMidia = tiposMidia.find(t => t.id === formData.tipo_midia_id);
  const problema = problemas.find(p => p.id === formData.problema_id);
  const servico = servicos.find(s => s.id === formData.servico_id);
  const bairro = filteredBairros.find(b => b.id === formData.bairro_id);
  const distrito = bairro ? distritos.find(d => d.id === bairro.distrito_id) : null;

  const handleEditStep = (stepIndex: number) => {
    if (onNavigateToStep) {
      onNavigateToStep(stepIndex);
    }
  };

  // Format date with specific format
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'dd/MM/yy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  // Helper to display review field with error highlight
  const ReviewField = ({ 
    label, 
    value, 
    fieldName, 
    step 
  }: { 
    label: string; 
    value: any; 
    fieldName?: string; 
    step: number 
  }) => {
    const hasError = fieldName ? hasFieldError(fieldName, errors) : false;
    return (
      <div className={`mb-4 ${showValidationErrors && hasError ? 'p-2 border border-orange-300 rounded-lg bg-orange-50' : ''}`}>
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm text-gray-500 font-medium">{label}</div>
          {step !== undefined && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-orange-500 hover:text-orange-600 p-0"
              onClick={() => handleEditStep(step)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="text-base">{value || '—'}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Origem e Classificação</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
            <ReviewField 
              label="Origem da demanda" 
              value={origem?.descricao} 
              fieldName="origem_id" 
              step={0} 
            />
            {formData.tem_protocolo_156 && (
              <ReviewField
                label="Protocolo 156"
                value={formData.numero_protocolo_156}
                fieldName="numero_protocolo_156"
                step={0}
              />
            )}
            {tipoMidia && (
              <ReviewField 
                label="Tipo de mídia" 
                value={tipoMidia.descricao} 
                fieldName="tipo_midia_id" 
                step={0} 
              />
            )}
            {formData.veiculo_imprensa && (
              <ReviewField 
                label="Veículo de imprensa" 
                value={formData.veiculo_imprensa} 
                fieldName="veiculo_imprensa" 
                step={0} 
              />
            )}
            <ReviewField 
              label="Prioridade" 
              value={formData.prioridade === 'media' ? 'Média' : 
                     formData.prioridade === 'alta' ? 'Alta' : 
                     formData.prioridade === 'baixa' ? 'Baixa' : 
                     formData.prioridade} 
              fieldName="prioridade" 
              step={0} 
            />
            <ReviewField 
              label="Prazo para resposta" 
              value={formatDate(formData.prazo_resposta)} 
              fieldName="prazo_resposta" 
              step={0} 
            />
          </div>

          <h3 className="font-medium text-gray-700 mb-3 mt-6">Informações do Solicitante</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
            <ReviewField 
              label="Nome do solicitante" 
              value={formData.nome_solicitante} 
              fieldName="nome_solicitante" 
              step={1} 
            />
            <ReviewField 
              label="Telefone" 
              value={formData.telefone_solicitante} 
              fieldName="telefone_solicitante" 
              step={1} 
            />
            <ReviewField 
              label="E-mail" 
              value={formData.email_solicitante} 
              fieldName="email_solicitante" 
              step={1} 
            />
          </div>

          <h3 className="font-medium text-gray-700 mb-3 mt-6">Tema e Serviço</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
            <ReviewField 
              label="Problema/Tema" 
              value={problema?.descricao} 
              fieldName="problema_id" 
              step={2} 
            />
            <ReviewField 
              label="Serviço" 
              value={servico?.descricao || (formData.nao_sabe_servico ? 'Não sabe informar' : '')} 
              fieldName="servico_id" 
              step={2} 
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-3">Localização</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
            <ReviewField 
              label="Distrito" 
              value={distrito?.nome} 
              step={2} 
            />
            <ReviewField 
              label="Bairro" 
              value={bairro?.nome} 
              fieldName="bairro_id" 
              step={2} 
            />
            <ReviewField 
              label="Endereço" 
              value={formData.endereco} 
              fieldName="endereco" 
              step={2} 
            />
          </div>

          <h3 className="font-medium text-gray-700 mb-3 mt-6">Detalhes da Demanda</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
            {/* Removed Detalhes da Demanda and replaced with Resumo */}
            <ReviewField 
              label="Resumo da situação" 
              value={formData.resumo_situacao} 
              fieldName="resumo_situacao" 
              step={3} 
            />
          </div>

          <h3 className="font-medium text-gray-700 mb-3 mt-6">Detalhes da Organização</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
            <ReviewField 
              label="Título da demanda" 
              value={formData.titulo} 
              fieldName="titulo" 
              step={3} 
            />
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm text-gray-500 font-medium">Perguntas para a área técnica</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-orange-500 hover:text-orange-600 p-0"
                  onClick={() => handleEditStep(3)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                {formData.perguntas.filter(Boolean).map((pergunta: string, idx: number) => (
                  <div key={idx} className="mb-2 text-base">
                    {idx + 1}. {pergunta}
                  </div>
                ))}
                {!formData.perguntas.filter(Boolean).length && <div className="text-base">—</div>}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm text-gray-500 font-medium">Anexos</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-orange-500 hover:text-orange-600 p-0"
                  onClick={() => handleEditStep(3)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                {formData.anexos && formData.anexos.length > 0 ? (
                  formData.anexos.map((anexo: string, idx: number) => (
                    <div key={idx} className="mb-1 text-base">{anexo}</div>
                  ))
                ) : (
                  <div className="text-base">Nenhum anexo</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
