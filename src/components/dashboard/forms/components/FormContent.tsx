
import React from 'react';
import IdentificationStep from '../steps/IdentificationStep';
import OriginClassificationStep from '../steps/OriginClassificationStep';
import RequesterInfoStep from '../steps/RequesterInfoStep';
import LocationStep from '../steps/LocationStep';
import QuestionsDetailsStep from '../steps/QuestionsDetailsStep';
import PriorityDeadlineStep from '../steps/PriorityDeadlineStep';
import { ValidationError } from '@/lib/formValidationUtils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const FORM_STEPS = [
  {
    title: "Identificação",
    description: "Selecione o tema, o serviço e informe os detalhes da demanda",
    fields: ["problema_id", "servico_id", "detalhes_solicitacao"]
  },
  {
    title: "Classificação e Origem",
    description: "Informe a origem e tipo de mídia da demanda",
    fields: ["origem_id", "tipo_midia_id"]
  },
  {
    title: "Dados do Solicitante",
    description: "Preencha os dados de contato do solicitante",
    fields: ["nome_solicitante", "telefone_solicitante", "email_solicitante", "veiculo_imprensa"]
  },
  {
    title: "Localização",
    description: "Informe a localização da demanda",
    fields: ["endereco", "bairro_id"]
  },
  {
    title: "Perguntas e Anexos",
    description: "Adicione perguntas para a área técnica e anexos",
    fields: ["perguntas", "anexos"]
  },
  {
    title: "Prioridade e Prazo",
    description: "Defina a prioridade e prazo para resposta",
    fields: ["prioridade", "prazo_resposta"]
  },
  {
    title: "Revisão",
    description: "Revise os dados informados antes de cadastrar",
    fields: ["titulo"]
  }
];

interface FormContentProps {
  activeStep: number;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleServiceSelect: (serviceId: string) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleAnexosChange?: (files: string[]) => void;
  areasCoord: any[];
  problemas: any[];
  filteredServicesBySearch: any[];
  serviceSearch: string;
  servicos: any[];
  origens: any[];
  tiposMidia: any[];
  selectedDistrito: string;
  setSelectedDistrito: (distrito: string) => void;
  distritos: any[];
  filteredBairros: any[];
  errors: ValidationError[];
}

const FormContent: React.FC<FormContentProps> = ({
  activeStep,
  formData,
  handleChange,
  handleSelectChange,
  handleServiceSelect,
  handlePerguntaChange,
  handleAnexosChange,
  areasCoord,
  problemas,
  filteredServicesBySearch,
  serviceSearch,
  servicos,
  origens,
  tiposMidia,
  selectedDistrito,
  setSelectedDistrito,
  distritos,
  filteredBairros,
  errors
}) => {
  switch (activeStep) {
    case 0:
      return (
        <IdentificationStep
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleServiceSelect={handleServiceSelect}
          problemas={problemas}
          filteredServicesBySearch={filteredServicesBySearch}
          serviceSearch={serviceSearch}
          servicos={servicos}
          errors={errors.filter(err => FORM_STEPS[0].fields.includes(err.field))}
        />
      );
    case 1:
      return (
        <OriginClassificationStep
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          origens={origens}
          tiposMidia={tiposMidia}
          errors={errors.filter(err => FORM_STEPS[1].fields.includes(err.field))}
        />
      );
    case 2:
      return (
        <RequesterInfoStep
          formData={formData}
          handleChange={handleChange}
          errors={errors.filter(err => FORM_STEPS[2].fields.includes(err.field))}
        />
      );
    case 3:
      return (
        <LocationStep
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          distritos={distritos}
          selectedDistrito={selectedDistrito}
          setSelectedDistrito={setSelectedDistrito}
          filteredBairros={filteredBairros}
          errors={errors.filter(err => FORM_STEPS[3].fields.includes(err.field))}
        />
      );
    case 4:
      return (
        <QuestionsDetailsStep
          formData={formData}
          handleChange={handleChange}
          handlePerguntaChange={handlePerguntaChange}
          handleSelectChange={handleSelectChange}
          handleAnexosChange={handleAnexosChange}
          errors={errors.filter(err => FORM_STEPS[4].fields.includes(err.field))}
        />
      );
    case 5:
      return (
        <PriorityDeadlineStep
          formData={formData}
          handleSelectChange={handleSelectChange}
          errors={errors.filter(err => FORM_STEPS[5].fields.includes(err.field))}
        />
      );
    case 6:
      return (
        <div className="space-y-6">
          <div>
            <Label htmlFor="titulo" className={`block mb-2 ${errors.some(err => err.field === 'titulo') ? 'text-orange-500 font-semibold' : ''}`}>
              Título da Demanda {errors.some(err => err.field === 'titulo') && <span className="text-orange-500">*</span>}
            </Label>
            <Input
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className={errors.some(err => err.field === 'titulo') ? 'border-orange-500' : ''}
              placeholder="Título da demanda"
            />
            {errors.some(err => err.field === 'titulo') && (
              <p className="text-orange-500 text-sm mt-1">
                {errors.find(err => err.field === 'titulo')?.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Sugestão baseada no serviço e bairro selecionados. Você pode editá-lo conforme necessário.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Resumo da Demanda</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold">Tema:</p>
                <p className="text-sm text-gray-700">
                  {problemas.find(p => p.id === formData.problema_id)?.descricao || '-'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold">Serviço:</p>
                <p className="text-sm text-gray-700">
                  {servicos.find(s => s.id === formData.servico_id)?.descricao || '-'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold">Origem:</p>
                <p className="text-sm text-gray-700">
                  {origens.find(o => o.id === formData.origem_id)?.descricao || '-'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold">Tipo de Mídia:</p>
                <p className="text-sm text-gray-700">
                  {tiposMidia.find(t => t.id === formData.tipo_midia_id)?.descricao || '-'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold">Solicitante:</p>
                <p className="text-sm text-gray-700">{formData.nome_solicitante || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold">Prioridade:</p>
                <p className="text-sm text-gray-700">{formData.prioridade || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold">Prazo de Resposta:</p>
                <p className="text-sm text-gray-700">
                  {formData.prazo_resposta ? new Date(formData.prazo_resposta).toLocaleDateString('pt-BR') : '-'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold">Bairro:</p>
                <p className="text-sm text-gray-700">
                  {filteredBairros.find(b => b.id === formData.bairro_id)?.nome || '-'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold">Endereço:</p>
                <p className="text-sm text-gray-700">{formData.endereco || '-'}</p>
              </div>
              
              {formData.veiculo_imprensa && (
                <div>
                  <p className="text-sm font-semibold">Veículo de Imprensa:</p>
                  <p className="text-sm text-gray-700">{formData.veiculo_imprensa}</p>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-semibold">Detalhes da Solicitação:</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.detalhes_solicitacao || '-'}</p>
            </div>
            
            {formData.perguntas.some(p => p.trim() !== '') && (
              <div className="mt-4">
                <p className="text-sm font-semibold">Perguntas para a Área Técnica:</p>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {formData.perguntas.filter(p => p.trim() !== '').map((pergunta, index) => (
                    <li key={index}>{pergunta}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {formData.anexos && formData.anexos.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold">Anexos:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.anexos.map((anexo, index) => (
                    <div key={index} className="bg-blue-50 px-2 py-1 rounded text-xs text-blue-700">
                      Arquivo {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    default:
      return <div>Passo não encontrado</div>;
  }
};

export default FormContent;
