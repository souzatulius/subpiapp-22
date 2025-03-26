
import { useState, useEffect, useMemo } from 'react';
import { DemandFormData } from './types';
import { supabase } from '@/integrations/supabase/client';

const FORM_STORAGE_KEY = 'demandForm_state';

export const useDemandFormState = (
  bairros: any[],
  problemas: any[]
) => {
  const initialFormState: DemandFormData = {
    titulo: '',
    problema_id: '',
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
    servico_id: '',
    nao_sabe_servico: false,
  };

  // Restore form state from localStorage on component mount
  const savedState = useMemo(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        try {
          const parsedState = JSON.parse(saved);
          return parsedState;
        } catch (error) {
          console.error('Error parsing saved form state:', error);
          return null;
        }
      }
    }
    return null;
  }, []);

  const [formData, setFormData] = useState<DemandFormData>(savedState?.formData || initialFormState);
  const [serviceSearch, setServiceSearch] = useState(savedState?.serviceSearch || '');
  const [filteredBairros, setFilteredBairros] = useState<any[]>([]);
  const [selectedDistrito, setSelectedDistrito] = useState(savedState?.selectedDistrito || '');
  const [activeStep, setActiveStep] = useState(savedState?.activeStep || 0);
  const [servicos, setServicos] = useState<any[]>([]);
  const [filteredServicos, setFilteredServicos] = useState<any[]>([]);

  // Save form state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stateToSave = {
        formData,
        serviceSearch,
        selectedDistrito,
        activeStep
      };
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [formData, serviceSearch, selectedDistrito, activeStep]);

  useEffect(() => {
    const fetchServicos = async () => {
      if (!formData.problema_id) {
        setServicos([]);
        setFilteredServicos([]);
        return;
      }

      try {
        const selectedProblem = problemas.find(p => p.id === formData.problema_id);
        if (!selectedProblem || !selectedProblem.supervisao_tecnica_id) {
          setServicos([]);
          setFilteredServicos([]);
          return;
        }

        const { data, error } = await supabase
          .from('servicos')
          .select('*')
          .eq('supervisao_tecnica_id', selectedProblem.supervisao_tecnica_id);

        if (error) throw error;
        setServicos(data || []);
        setFilteredServicos(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServicos([]);
        setFilteredServicos([]);
      }
    };

    fetchServicos();
  }, [formData.problema_id, problemas]);

  useEffect(() => {
    if (activeStep === 6) {
      generateTitleSuggestion();
    }
  }, [activeStep, formData.problema_id, formData.bairro_id, formData.servico_id]);

  const generateTitleSuggestion = () => {
    if (!formData.titulo || formData.titulo.trim() === '' || activeStep === 6) {
      let suggestedTitle = '';
      
      const selectedService = servicos.find(s => s.id === formData.servico_id);
      const selectedProblem = problemas.find(p => p.id === formData.problema_id);
      const selectedBairro = bairros.find(b => b.id === formData.bairro_id);
      
      if (selectedService && !formData.nao_sabe_servico) {
        suggestedTitle = selectedService.descricao;
      } else if (selectedProblem) {
        suggestedTitle = selectedProblem.descricao;
      }
      
      if (selectedBairro) {
        suggestedTitle += ` - ${selectedBairro.nome}`;
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
    if (selectedDistrito) {
      const filtered = bairros.filter(
        bairro => bairro.distrito_id === selectedDistrito
      );
      setFilteredBairros(filtered);
    } else {
      setFilteredBairros([]);
    }
  }, [selectedDistrito, bairros]);

  useEffect(() => {
    if (formData.nao_sabe_servico) {
      setFormData(prev => ({
        ...prev,
        servico_id: ''
      }));
    }
  }, [formData.nao_sabe_servico]);

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
    if (name === 'problema_id' && typeof value === 'string' && value !== formData.problema_id) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        servico_id: '',
        nao_sabe_servico: false
      }));
    } else if (name === 'nao_sabe_servico') {
      setFormData(prev => ({
        ...prev,
        nao_sabe_servico: Boolean(value),
        servico_id: value ? '' : prev.servico_id
      }));
    } else if (typeof value === 'string') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (typeof value === 'boolean' && name !== 'problema_id') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

  const handleServiceSearch = (value: string) => {
    setServiceSearch(value);
    if (!value.trim()) {
      setFilteredServicos(servicos);
      return;
    }
    
    const filtered = servicos.filter(
      servico => servico.descricao.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredServicos(filtered);
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
    localStorage.removeItem(FORM_STORAGE_KEY);
  };

  return {
    formData,
    serviceSearch,
    filteredBairros,
    selectedDistrito,
    activeStep,
    handleChange,
    handleSelectChange,
    handlePerguntaChange,
    handleAnexosChange,
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm,
    setActiveStep,
    servicos,
    filteredServicos,
    handleServiceSearch
  };
};
