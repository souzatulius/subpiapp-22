
import { useState, useEffect, useMemo } from 'react';
import { DemandFormData } from './types';

export const useDemandFormState = (
  servicos: any[],
  bairros: any[],
  problemas: any[]
) => {
  const initialFormState: DemandFormData = {
    titulo: '',
    problema_id: '',
    servico_id: '',
    origem_id: '',
    tipo_midia_id: '',
    prioridade: 'media',
    prazo_resposta: '',
    nome_solicitante: '',
    telefone_solicitante: '',
    email_solicitante: '',
    veiculo_imprensa: '',
    endereco: '',
    bairro_id: '',
    perguntas: ['', '', '', '', ''],
    detalhes_solicitacao: '',
    arquivo_url: '',
    anexos: [],
  };

  const [formData, setFormData] = useState<DemandFormData>(initialFormState);
  const [serviceSearch, setServiceSearch] = useState('');
  const [filteredServicos, setFilteredServicos] = useState<any[]>([]);
  const [filteredBairros, setFilteredBairros] = useState<any[]>([]);
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  // Generate title suggestion when reaching the review step
  useEffect(() => {
    if (activeStep === 6) {
      generateTitleSuggestion();
    }
  }, [activeStep, formData.problema_id, formData.bairro_id]);

  // Update title when problema or bairro changes while on review step
  useEffect(() => {
    if (activeStep === 6) {
      generateTitleSuggestion();
    }
  }, [formData.problema_id, formData.bairro_id]);

  const generateTitleSuggestion = () => {
    // Only generate if we don't already have a title
    if (!formData.titulo || formData.titulo.trim() === '') {
      const selectedProblema = problemas.find(p => p.id === formData.problema_id);
      const selectedBairro = bairros.find(b => b.id === formData.bairro_id);
      
      let suggestedTitle = '';
      
      if (selectedProblema) {
        suggestedTitle = selectedProblema.descricao;
        
        if (selectedBairro) {
          suggestedTitle += ` - ${selectedBairro.nome}`;
        }
        
        if (formData.detalhes_solicitacao && formData.detalhes_solicitacao.length > 0) {
          // Add a short snippet from details if available (first 30 chars)
          const detailsSnippet = formData.detalhes_solicitacao.substring(0, 30).trim();
          if (detailsSnippet.length > 0) {
            suggestedTitle += ` (${detailsSnippet}${formData.detalhes_solicitacao.length > 30 ? '...' : ''})`;
          }
        }
      } else if (selectedBairro) {
        suggestedTitle = `Demanda ${selectedBairro.nome}`;
      }
      
      if (suggestedTitle) {
        setFormData(prev => ({
          ...prev,
          titulo: suggestedTitle
        }));
      }
    }
  };

  useEffect(() => {
    if (formData.problema_id) {
      const filtered = servicos.filter(
        service => service.problema_id === formData.problema_id
      );
      setFilteredServicos(filtered);
    } else {
      setFilteredServicos([]);
    }
  }, [formData.problema_id, servicos]);

  useEffect(() => {
    if (selectedDistrito) {
      const filtered = bairros.filter(
        bairro => bairro.distrito_id === selectedDistrito
      );
      setFilteredBairros(filtered);
    } else {
      setFilteredBairros([]);
    }
  }, [selectedDistrito, bairros]);

  const filteredServicesBySearch = useMemo(() => {
    if (!serviceSearch) return filteredServicos;
    return filteredServicos.filter(service => 
      service.descricao.toLowerCase().includes(serviceSearch.toLowerCase())
    );
  }, [filteredServicos, serviceSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'serviceSearch') {
      setServiceSearch(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceSelect = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      servico_id: serviceId
    }));
    setServiceSearch('');
  };

  const handlePerguntaChange = (index: number, value: string) => {
    const updatedPerguntas = [...formData.perguntas];
    updatedPerguntas[index] = value;
    setFormData(prev => ({
      ...prev,
      perguntas: updatedPerguntas
    }));
  };

  const handleAnexosChange = (files: string[]) => {
    setFormData(prev => ({
      ...prev,
      anexos: files
    }));
  };

  const nextStep = () => {
    if (activeStep < 6) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setServiceSearch('');
    setSelectedDistrito('');
    setActiveStep(0);
  };

  return {
    formData,
    serviceSearch,
    filteredServicos,
    filteredBairros,
    selectedDistrito,
    activeStep,
    filteredServicesBySearch,
    handleChange,
    handleSelectChange,
    handleServiceSelect,
    handlePerguntaChange,
    handleAnexosChange,
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm,
    setActiveStep
  };
};
