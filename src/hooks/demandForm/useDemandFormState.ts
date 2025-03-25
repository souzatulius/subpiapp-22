
import { useState, useEffect, useMemo } from 'react';
import { DemandFormData } from './types';

export const useDemandFormState = (
  servicos: any[],
  bairros: any[]
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
    arquivo_url: ''
  };

  const [formData, setFormData] = useState<DemandFormData>(initialFormState);
  const [serviceSearch, setServiceSearch] = useState('');
  const [filteredServicos, setFilteredServicos] = useState<any[]>([]);
  const [filteredBairros, setFilteredBairros] = useState<any[]>([]);
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  // Generate title suggestion based on service and bairro
  useEffect(() => {
    // Only auto-generate title if we're on step 5 and moving to step 6
    if (activeStep === 5) {
      const selectedService = servicos.find(s => s.id === formData.servico_id);
      const selectedBairro = bairros.find(b => b.id === formData.bairro_id);
      
      if (selectedService && selectedBairro) {
        const suggestedTitle = `${selectedService.descricao} - ${selectedBairro.nome}`;
        setFormData(prev => ({
          ...prev,
          titulo: suggestedTitle
        }));
      } else if (selectedService) {
        setFormData(prev => ({
          ...prev,
          titulo: selectedService.descricao
        }));
      }
    }
  }, [activeStep, formData.servico_id, formData.bairro_id, servicos, bairros]);

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

  const handleSelectChange = (name: string, value: string) => {
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

  const nextStep = () => {
    // Check against FORM_STEPS.length - 1 (6) instead of hardcoded value
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
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm,
    setActiveStep
  };
};
