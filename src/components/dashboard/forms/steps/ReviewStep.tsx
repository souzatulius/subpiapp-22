import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DemandFormData } from '@/hooks/demandForm/types';
import { formatDateTime } from '@/lib/utils';
import { ValidationError } from '@/lib/formValidationUtils';

interface ReviewStepProps {
  formData: DemandFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  handleChange,
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
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const selectedProblema = problemas.find(problema => problema.id === formData.problema_id);
  const selectedOrigin = origens.find(origem => origem.id === formData.origem_id);
  const selectedTipoMidia = tiposMidia.find(tipoMidia => tipoMidia.id === formData.tipo_midia_id);
  const selectedBairro = filteredBairros.find(bairro => bairro.id === formData.bairro_id);
  const selectedDistrito = distritos.find(distrito => distrito.id === selectedBairro?.distrito_id);
  const selectedServico = servicos.find(servico => servico.id === formData.servico_id);
  const areasCoord = problemas.map(problema => ({
    id: problema.coordenacao_id,
    descricao: problema.coordenacao_id
  }));

  const prioridadeDisplay: { [key: string]: string } = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa',
  };

  const renderInfoGroup = (label: string, value: string | React.ReactNode, step?: number, hasValue: boolean = true) => (
    <div className="mb-2">
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-500">{label}</p>
        {typeof step === 'number' && onNavigateToStep && (
          <button
            onClick={() => onNavigateToStep(step)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          >
            Editar
          </button>
        )}
      </div>
      <div className={`${hasValue ? 'text-gray-800' : 'text-gray-400 italic'} text-sm`}>
        {hasValue ? value : 'Não informado'}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="review-demanda space-y-4">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Dados da demanda</h3>
          
          {/* Protocolo (Novo campo) */}
          {renderInfoGroup(
            "Protocolo",
            formData.protocolo || "",
            0,
            Boolean(formData.protocolo)
          )}

          {renderInfoGroup(
            "Origem da demanda",
            selectedOrigin?.descricao || "",
            0,
            Boolean(selectedOrigin)
          )}
          
          {/* Mostrar protocolo 156 se aplicável */}
          {formData.tem_protocolo_156 && (
            renderInfoGroup(
              "Protocolo 156",
              formData.numero_protocolo_156 || "",
              0,
              Boolean(formData.numero_protocolo_156)
            )
          )}
          
          {renderInfoGroup(
            "Prioridade",
            prioridadeDisplay[formData.prioridade] || "",
            0,
            Boolean(formData.prioridade)
          )}
          
          {renderInfoGroup(
            "Prazo para resposta",
            formData.prazo_resposta ? formatDateTime(new Date(formData.prazo_resposta)) : "",
            0,
            Boolean(formData.prazo_resposta)
          )}
          
          {/* Coordenação (Novo campo) */}
          {renderInfoGroup(
            "Coordenação",
            areasCoord.find(a => a.id === formData.coordenacao_id)?.descricao || "",
            2,
            Boolean(formData.coordenacao_id)
          )}
          
          {renderInfoGroup(
            "Tema",
            selectedProblema?.descricao || "",
            2,
            Boolean(selectedProblema)
          )}
          
          {renderInfoGroup(
            "Serviço",
            formData.nao_sabe_servico
              ? "Não sei o serviço específico"
              : selectedServico?.descricao || "",
            2,
            formData.nao_sabe_servico || Boolean(selectedServico)
          )}
          
          {/* Detalhes da solicitação */}
          {renderInfoGroup(
            "Detalhes da solicitação",
            <div className="whitespace-pre-line">{formData.detalhes_solicitacao || ""}</div>,
            0,
            Boolean(formData.detalhes_solicitacao)
          )}
          
          {/* Resumo da situação (Novo campo) */}
          {renderInfoGroup(
            "Resumo da situação",
            <div className="whitespace-pre-line">{formData.resumo_situacao || ""}</div>,
            3,
            Boolean(formData.resumo_situacao)
          )}
        </div>
        
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Dados do solicitante</h3>
          {renderInfoGroup(
            "Nome do solicitante",
            formData.nome_solicitante || "",
            1,
            Boolean(formData.nome_solicitante)
          )}
          {renderInfoGroup(
            "Telefone do solicitante",
            formData.telefone_solicitante || "",
            1,
            Boolean(formData.telefone_solicitante)
          )}
          {renderInfoGroup(
            "Email do solicitante",
            formData.email_solicitante || "",
            1,
            Boolean(formData.email_solicitante)
          )}
          {renderInfoGroup(
            "Veículo de imprensa",
            formData.veiculo_imprensa || "",
            1,
            Boolean(formData.veiculo_imprensa)
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Localização</h3>
          {renderInfoGroup(
            "Endereço",
            formData.endereco || "",
            2,
            Boolean(formData.endereco)
          )}
          {renderInfoGroup(
            "Bairro",
            selectedBairro?.nome || "",
            2,
            Boolean(selectedBairro)
          )}
          {renderInfoGroup(
            "Distrito",
            selectedDistrito?.nome || "",
            2,
            Boolean(selectedDistrito)
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Outras informações</h3>
          {formData.perguntas.map((pergunta, index) => (
            <div key={index} className="mb-2">
              <p className="text-sm text-gray-500">Pergunta {index + 1}</p>
              <p className="text-sm text-gray-800">{pergunta || 'Não informada'}</p>
            </div>
          ))}
        </div>
      </div>
      
      {showValidationErrors && errors.length > 0 && (
        <div className="rounded-md bg-orange-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              {/* Ícone de alerta aqui */}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                Preencha todos os campos obrigatórios antes de enviar.
              </h3>
              <div className="mt-2 text-sm text-orange-700">
                <ul className="list-disc space-y-1 pl-5">
                  {errors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
