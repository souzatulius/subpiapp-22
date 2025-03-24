import React from 'react';
import IdentificationStep from '../steps/IdentificationStep';
import OriginClassificationStep from '../steps/OriginClassificationStep';
import PriorityDeadlineStep from '../steps/PriorityDeadlineStep';
import RequesterInfoStep from '../steps/RequesterInfoStep';
import LocationStep from '../steps/LocationStep';
import QuestionsDetailsStep from '../steps/QuestionsDetailsStep';
import { FormStep } from './FormSteps';
import { DemandFormData } from '@/hooks/demandForm';
import { ValidationError } from '@/lib/formValidationUtils';

interface FormContentProps {
  activeStep: number;
  formData: DemandFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleServiceSelect: (serviceId: string) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  areasCoord: any[];
  filteredServicesBySearch: any[];
  serviceSearch: string;
  servicos: any[];
  origens: any[];
  tiposMidia: any[];
  selectedDistrito: string;
  setSelectedDistrito: (value: string) => void;
  distritos: any[];
  filteredBairros: any[];
  errors?: ValidationError[];
}

export const FORM_STEPS: FormStep[] = [
  {
    title: "Detalhes da Solicitação",
    description: "Explique a solicitação ou cole a solicitação recebida"
  },
  {
    title: "Identificação da Demanda",
    description: "Informe os detalhes básicos da solicitação"
  }, 
  {
    title: "Origem e Classificação",
    description: "Selecione a origem e tipo de mídia"
  }, 
  {
    title: "Prioridade e Prazo",
    description: "Defina a prioridade e prazo para resposta"
  }, 
  {
    title: "Dados do Solicitante",
    description: "Informe os dados de contato (opcional)"
  }, 
  {
    title: "Localização",
    description: "Informe o endereço e bairro relacionado"
  },
  {
    title: "Título e Perguntas",
    description: "Revisar título sugerido e adicionar perguntas"
  }
];

const FormContent: React.FC<FormContentProps> = ({
  activeStep,
  formData,
  handleChange,
  handleSelectChange,
  handleServiceSelect,
  handlePerguntaChange,
  areasCoord,
  filteredServicesBySearch,
  serviceSearch,
  servicos,
  origens,
  tiposMidia,
  selectedDistrito,
  setSelectedDistrito,
  distritos,
  filteredBairros,
  errors = []
}) => {
  switch (activeStep) {
    case 0:
      // Detalhes da Solicitação (moved from QuestionsDetailsStep)
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="detalhes_solicitacao" className={`block text-sm font-medium ${errors.some(err => err.field === 'detalhes_solicitacao') ? 'text-orange-500 font-semibold' : 'text-gray-700'}`}>
              Explique a solicitação ou cole a solicitação recebida
            </label>
            <textarea
              id="detalhes_solicitacao"
              name="detalhes_solicitacao"
              value={formData.detalhes_solicitacao}
              onChange={handleChange}
              rows={10}
              className={`mt-1 w-full rounded-xl px-4 py-3 border ${
                errors.some(err => err.field === 'detalhes_solicitacao') 
                  ? 'border-orange-500' 
                  : 'border-gray-300'
              } bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#174ba9]`}
            />
            {errors.some(err => err.field === 'detalhes_solicitacao') && (
              <p className="text-orange-500 text-sm mt-1">
                {errors.find(err => err.field === 'detalhes_solicitacao')?.message}
              </p>
            )}
          </div>
        </div>
      );
    case 1:
      return (
        <IdentificationStep 
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleServiceSelect={handleServiceSelect}
          areasCoord={areasCoord}
          filteredServicesBySearch={filteredServicesBySearch}
          serviceSearch={serviceSearch}
          servicos={servicos}
          errors={errors}
          showTitleField={false}
        />
      );
    case 2:
      return (
        <OriginClassificationStep 
          formData={formData}
          handleSelectChange={handleSelectChange}
          origens={origens}
          tiposMidia={tiposMidia}
          errors={errors}
        />
      );
    case 3:
      return (
        <PriorityDeadlineStep 
          formData={formData}
          handleSelectChange={handleSelectChange}
          errors={errors}
        />
      );
    case 4:
      return (
        <RequesterInfoStep 
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />
      );
    case 5:
      return (
        <LocationStep 
          formData={formData}
          selectedDistrito={selectedDistrito}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          setSelectedDistrito={setSelectedDistrito}
          distritos={distritos}
          filteredBairros={filteredBairros}
          errors={errors}
        />
      );
    case 6:
      return (
        <div className="space-y-6">
          <div>
            <label htmlFor="titulo" className={`block text-sm font-medium ${errors.some(err => err.field === 'titulo') ? 'text-orange-500 font-semibold' : 'text-gray-700'}`}>
              Título da Demanda {errors.some(err => err.field === 'titulo') && <span className="text-orange-500">*</span>}
            </label>
            <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm flex items-center px-4 transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-subpi-blue focus-within:ring-offset-1">
              <input 
                id="titulo" 
                name="titulo" 
                value={formData.titulo} 
                onChange={handleChange} 
                className={`border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full py-3 ${errors.some(err => err.field === 'titulo') ? 'placeholder-orange-300' : ''}`} 
                placeholder="Digite o título da demanda..."
              />
            </div>
            {errors.some(err => err.field === 'titulo') && (
              <p className="text-orange-500 text-sm mt-1">
                {errors.find(err => err.field === 'titulo')?.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Título sugerido com base no serviço e bairro selecionados.
            </p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`block text-sm font-medium ${errors.some(err => err.field === 'perguntas') ? 'text-orange-500 font-semibold' : 'text-gray-700'}`}>
                Perguntas
              </label>
              {formData.perguntas.filter(p => p.trim() !== '').length < 5 && (
                <button 
                  type="button" 
                  onClick={() => {
                    const activeQuestions = formData.perguntas.filter(p => p.trim() !== '').length;
                    const updatedPerguntas = [...formData.perguntas];
                    if (activeQuestions < 5) {
                      updatedPerguntas[activeQuestions] = '';
                      handleSelectChange('perguntas', JSON.stringify(updatedPerguntas));
                    }
                  }}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center gap-1"
                >
                  + Adicionar pergunta
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {formData.perguntas.map((pergunta, index) => {
                if (index < 5 && (index === 0 || formData.perguntas[index-1].trim() !== '' || pergunta.trim() !== '')) {
                  return (
                    <div key={index} className="flex gap-2">
                      <input
                        value={pergunta}
                        onChange={(e) => handlePerguntaChange(index, e.target.value)}
                        className={`w-full rounded-md border ${
                          errors.some(err => err.field === 'perguntas') ? 'border-orange-500' : 'border-gray-300'
                        } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder={`Pergunta ${index + 1}`}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPerguntas = [...formData.perguntas];
                            // Remove this question and shift others up
                            for (let i = index; i < 4; i++) {
                              updatedPerguntas[i] = updatedPerguntas[i + 1];
                            }
                            updatedPerguntas[4] = '';
                            handleSelectChange('perguntas', JSON.stringify(updatedPerguntas));
                          }}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
            
            {errors.some(err => err.field === 'perguntas') && (
              <p className="text-orange-500 text-sm mt-1">
                {errors.find(err => err.field === 'perguntas')?.message}
              </p>
            )}
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default FormContent;
