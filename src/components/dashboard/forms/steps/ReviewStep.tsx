
import React from 'react';
import { ValidationError } from '@/lib/formValidationUtils';
import { formatDateToString } from '@/lib/inputFormatting';
import { Edit2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReviewStepProps {
  formData: any;
  problemas: any[];
  origens: any[];
  tiposMidia: any[];
  filteredBairros: any[];
  distritos: any[];
  servicos: any[];
  errors: ValidationError[];
  showValidationErrors?: boolean;
  onNavigateToStep?: (step: number) => void;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  // Helper function to find entity by ID
  const findById = (collection: any[], id: string): any => {
    return collection.find(item => item.id === id) || {};
  };

  // Get names for entities from their IDs
  const getProblemaName = () => {
    const problema = findById(problemas, formData.problema_id);
    return problema?.descricao || 'Não especificado';
  };

  const getOrigemName = () => {
    const origem = findById(origens, formData.origem_id);
    return origem?.descricao || 'Não especificado';
  };

  const getTipoMidiaName = () => {
    const tipoMidia = findById(tiposMidia, formData.tipo_midia_id);
    return tipoMidia?.descricao || 'Não especificado';
  };

  const getBairroName = () => {
    const bairro = findById(filteredBairros, formData.bairro_id);
    return bairro?.nome || 'Não especificado';
  };

  const getServicoName = () => {
    if (formData.nao_sabe_servico) return 'Não sabe o serviço específico';
    const servico = findById(servicos, formData.servico_id);
    return servico?.descricao || 'Não especificado';
  };

  const getDistritoName = () => {
    const bairro = findById(filteredBairros, formData.bairro_id);
    if (!bairro || !bairro.distrito_id) return 'Não especificado';
    
    const distrito = findById(distritos, bairro.distrito_id);
    return distrito?.nome || 'Não especificado';
  };

  const formatPrioridade = (prioridade: string) => {
    if (prioridade === 'alta') return 'Urgente';
    if (prioridade === 'media') return 'Normal';
    if (prioridade === 'baixa') return 'Baixa';
    return prioridade || 'Não especificado';
  };

  // Format date time from ISO to human readable
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Não especificado';
    try {
      return formatDateToString(new Date(isoString));
    } catch (e) {
      console.error('Error formatting date time:', e);
      return 'Data inválida';
    }
  };

  // Check if a field has a validation error
  const hasError = (field: string) => {
    return errors.some(error => error.field === field);
  };

  // Group related fields for better organization
  const reviewSections = [
    {
      title: 'Informações Básicas',
      step: 0,
      fields: [
        { label: 'Origem da Demanda', value: getOrigemName(), field: 'origem_id' },
        { label: 'Prioridade', value: formatPrioridade(formData.prioridade), field: 'prioridade' },
        { label: 'Prazo de Resposta', value: formatDateTime(formData.prazo_resposta), field: 'prazo_resposta' },
      ]
    },
    {
      title: 'Dados do Solicitante',
      step: 1,
      fields: [
        { label: 'Nome do Solicitante', value: formData.nome_solicitante || 'Não informado', field: 'nome_solicitante' },
        { label: 'Telefone', value: formData.telefone_solicitante || 'Não informado', field: 'telefone_solicitante' },
        { label: 'Email', value: formData.email_solicitante || 'Não informado', field: 'email_solicitante' },
        { label: 'Tipo de Mídia', value: getTipoMidiaName(), field: 'tipo_midia_id' },
        { label: 'Veículo de Imprensa', value: formData.veiculo_imprensa || 'Não informado', field: 'veiculo_imprensa' },
      ]
    },
    {
      title: 'Tema e Localização',
      step: 2,
      fields: [
        { label: 'Tema', value: getProblemaName(), field: 'problema_id' },
        { label: 'Serviço', value: getServicoName(), field: 'servico_id' },
        { label: 'Distrito', value: getDistritoName(), field: '' },
        { label: 'Bairro', value: getBairroName(), field: 'bairro_id' },
        { label: 'Endereço', value: formData.endereco || 'Não informado', field: 'endereco' },
      ]
    },
    {
      title: 'Detalhes da Solicitação',
      step: 2,
      fields: [
        { 
          label: 'Detalhes', 
          value: formData.detalhes_solicitacao || 'Não informado', 
          field: 'detalhes_solicitacao',
          isMultiline: true 
        },
      ]
    },
    {
      title: 'Organização',
      step: 3,
      fields: [
        { label: 'Título', value: formData.titulo || 'Não informado', field: 'titulo' },
        { 
          label: 'Resumo da Situação', 
          value: formData.resumo_situacao || 'Não informado', 
          field: 'resumo_situacao',
          isMultiline: true 
        },
      ]
    },
    {
      title: 'Perguntas',
      step: 3,
      fields: formData.perguntas.map((pergunta: string, index: number) => ({
        label: `Pergunta ${index + 1}`,
        value: pergunta || 'Não informado',
        field: `perguntas[${index}]`,
        isMultiline: true
      }))
    }
  ];

  return (
    <div className="space-y-8">
      {showValidationErrors && errors.length > 0 && (
        <Alert variant="destructive" className="bg-orange-50 border-orange-200 text-orange-800 rounded-xl">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription>
            Por favor, corrija os campos destacados antes de enviar.
          </AlertDescription>
        </Alert>
      )}

      {reviewSections.map((section, idx) => (
        <div key={`section-${idx}`} className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">{section.title}</h4>
            {onNavigateToStep && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigateToStep(section.step)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Editar
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((field, fieldIdx) => (
              <div 
                key={`field-${fieldIdx}`}
                className={`p-4 bg-gray-50 rounded-lg border ${hasError(field.field) ? 'border-orange-300 bg-orange-50' : 'border-gray-200'} ${field.isMultiline ? 'col-span-1 md:col-span-2' : ''}`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 mb-1">
                    {field.label}
                    {hasError(field.field) && <span className="text-orange-500 ml-1">*</span>}
                  </span>
                  <div className={`${field.isMultiline ? 'whitespace-pre-wrap' : ''} ${hasError(field.field) ? 'text-orange-700 font-medium' : 'text-gray-800'}`}>
                    {field.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewStep;
