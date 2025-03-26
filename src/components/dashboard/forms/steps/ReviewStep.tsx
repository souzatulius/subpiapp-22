
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { DemandFormData } from '@/hooks/demandForm/types';
import { ValidationError } from '@/lib/formValidationUtils';

interface ReviewStepProps {
  formData: DemandFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  problemas: any[];
  origens: any[];
  tiposMidia: any[];
  filteredBairros: any[];
  servicos: any[];
  errors?: ValidationError[];
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  handleChange,
  problemas,
  origens,
  tiposMidia,
  filteredBairros,
  servicos,
  errors = []
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const getProblemaDescricao = () => {
    const problema = problemas.find(p => p.id === formData.problema_id);
    return problema ? problema.descricao : 'Não informado';
  };

  const getServicoDescricao = () => {
    if (formData.nao_sabe_servico) return 'Não informado pelo solicitante';
    const servico = servicos.find(s => s.id === formData.servico_id);
    return servico ? servico.descricao : 'Não informado';
  };

  const getOrigemDescricao = () => {
    const origem = origens.find(o => o.id === formData.origem_id);
    return origem ? origem.descricao : 'Não informado';
  };

  const getTipoMidiaDescricao = () => {
    const tipoMidia = tiposMidia.find(t => t.id === formData.tipo_midia_id);
    return tipoMidia ? tipoMidia.descricao : 'Não informado';
  };

  const getBairroNome = () => {
    const bairro = filteredBairros.find(b => b.id === formData.bairro_id);
    return bairro ? bairro.nome : 'Não informado';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Não informado';
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className={`block text-sm font-medium ${hasError('titulo') ? 'text-orange-500' : 'text-gray-700'} mb-1`}>
          Título da Demanda
        </label>
        <Input
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className={`w-full ${hasError('titulo') ? 'border-orange-500' : ''}`}
        />
        {hasError('titulo') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('titulo')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-800 mb-4">Informações da Demanda</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Protocolo 156:</p>
              <p className="font-medium">
                {formData.tem_protocolo_156 ? 
                  (formData.numero_protocolo_156 || 'Sim, número não informado') : 
                  'Não possui'
                }
              </p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Origem:</p>
              <p className="font-medium">{getOrigemDescricao()}</p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Tipo de Mídia:</p>
              <p className="font-medium">{getTipoMidiaDescricao()}</p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Prioridade:</p>
              <p className="font-medium capitalize">{
                formData.prioridade === 'alta' ? 'Alta' :
                formData.prioridade === 'media' ? 'Média' :
                formData.prioridade === 'baixa' ? 'Baixa' : 
                formData.prioridade
              }</p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Prazo de Resposta:</p>
              <p className="font-medium">{formatDate(formData.prazo_resposta)}</p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Tema/Problema:</p>
              <p className="font-medium">{getProblemaDescricao()}</p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Serviço:</p>
              <p className="font-medium">{getServicoDescricao()}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-800 mb-4">Informações do Solicitante</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Nome:</p>
              <p className="font-medium">{formData.nome_solicitante || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Telefone:</p>
              <p className="font-medium">{formData.telefone_solicitante || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Email:</p>
              <p className="font-medium">{formData.email_solicitante || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Veículo de Imprensa:</p>
              <p className="font-medium">{formData.veiculo_imprensa || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Bairro:</p>
              <p className="font-medium">{getBairroNome()}</p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Endereço:</p>
              <p className="font-medium">{formData.endereco || 'Não informado'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-800 mb-2">Detalhes da Solicitação</h3>
        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="whitespace-pre-line">{formData.detalhes_solicitacao || 'Não informado'}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-800 mb-2">Perguntas</h3>
        <div className="bg-gray-50 p-3 rounded-lg border">
          {formData.perguntas.filter(p => p.trim()).length > 0 ? (
            <ol className="list-decimal list-inside space-y-2">
              {formData.perguntas
                .filter(pergunta => pergunta.trim())
                .map((pergunta, index) => (
                  <li key={index}>{pergunta}</li>
                ))
              }
            </ol>
          ) : (
            <p className="text-gray-500">Nenhuma pergunta adicionada</p>
          )}
        </div>
      </div>
      
      {formData.anexos.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Anexos</h3>
          <div className="bg-gray-50 p-3 rounded-lg border">
            <ul className="list-disc list-inside space-y-1">
              {formData.anexos.map((anexo, index) => (
                <li key={index} className="text-blue-600 truncate">
                  {typeof anexo === 'string' 
                    ? anexo.split('/').pop() || `Anexo ${index + 1}`
                    : `Anexo ${index + 1}`
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
