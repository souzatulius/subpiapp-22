import { useState, useEffect, useMemo } from 'react';
import { DemandFormData } from './types';
import { supabase } from '@/integrations/supabase/client';
import { generateTitleSuggestion } from '../../components/dashboard/forms/steps/organize/utils';
import { toast } from '@/components/ui/use-toast';

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
    prioridade: '',
    prazo_resposta: '',
    nome_solicitante: '',
    telefone_solicitante: '',
    email_solicitante: '',
    veiculo_imprensa: '',
    endereco: '',
    bairro_id: '',
    perguntas: ['', '', '', '', ''],
    detalhes_solicitacao: '',
    resumo_situacao: '',
    arquivo_url: '',
    anexos: [],
    servico_id: '',
    nao_sabe_servico: false,
    tem_protocolo_156: undefined,
    numero_protocolo_156: '',
    coordenacao_id: ''
  };

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
        const { data, error } = await supabase
          .from('servicos')
          .select('*')
          .eq('problema_id', formData.problema_id);

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
  }, [formData.problema_id]);

  useEffect(() => {
    if (formData.problema_id) {
      const selectedProblem = problemas.find(p => p.id === formData.problema_id);
      if (selectedProblem && selectedProblem.coordenacao_id) {
        setFormData(prev => ({
          ...prev,
          coordenacao_id: selectedProblem.coordenacao_id
        }));
      }
    }
  }, [formData.problema_id, problemas]);

  useEffect(() => {
    if (formData.problema_id || formData.servico_id || formData.bairro_id || formData.endereco) {
      const suggestedTitle = generateTitleSuggestion(formData, problemas, servicos, filteredBairros);
      
      if (suggestedTitle && (!formData.titulo || formData.titulo.trim() === '')) {
        setFormData(prev => ({
          ...prev,
          titulo: suggestedTitle
        }));
      }
    }
  }, [
    formData.problema_id, 
    formData.servico_id, 
    formData.bairro_id, 
    formData.endereco,
    problemas,
    servicos,
    filteredBairros
  ]);

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
    } else if (name === 'telefone_solicitante') {
      const digits = value.replace(/\D/g, '');
      let formattedValue = '';
      
      if (digits.length <= 2) {
        formattedValue = digits.length ? `(${digits}` : '';
      } else if (digits.length <= 7) {
        formattedValue = `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
      } else {
        formattedValue = `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
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

  const generateAIContent = async () => {
    if (!formData.problema_id || !formData.detalhes_solicitacao) {
      console.error('Missing required data for AI content generation');
      return;
    }

    try {
      const selectedProblem = problemas.find(p => p.id === formData.problema_id);
      let serviceName = '';
      if (formData.servico_id) {
        const service = servicos.find(s => s.id === formData.servico_id);
        if (service) {
          serviceName = service.descricao;
        }
      }

      let bairroName = '';
      if (formData.bairro_id) {
        const bairro = filteredBairros.find(b => b.id === formData.bairro_id);
        if (bairro) {
          bairroName = bairro.nome;
        }
      }

      const { data, error } = await supabase.functions.invoke('generate-demand-content', {
        body: {
          problem: selectedProblem?.descricao || '',
          service: serviceName,
          neighborhood: bairroName,
          address: formData.endereco || '',
          details: formData.detalhes_solicitacao
        }
      });

      if (error) {
        console.error('Error calling Edge Function:', error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setFormData(prev => ({
        ...prev,
        titulo: data.title || prev.titulo,
        resumo_situacao: data.resumo || prev.resumo_situacao,
        perguntas: [
          data.perguntas?.[0] || '',
          data.perguntas?.[1] || '',
          data.perguntas?.[2] || '',
          prev.perguntas[3] || '',
          prev.perguntas[4] || ''
        ]
      }));

      toast({
        title: "Conteúdo gerado com sucesso",
        description: "Título, resumo e perguntas foram gerados automaticamente.",
      });
    } catch (error) {
      console.error('Error generating AI content:', error);
      
      const selectedProblem = problemas.find(p => p.id === formData.problema_id);
      let serviceName = '';
      if (formData.servico_id) {
        const service = servicos.find(s => s.id === formData.servico_id);
        if (service) {
          serviceName = service.descricao;
        }
      }

      let bairroName = '';
      if (formData.bairro_id) {
        const bairro = filteredBairros.find(b => b.id === formData.bairro_id);
        if (bairro) {
          bairroName = bairro.nome;
        }
      }

      const aiTitle = `Solicitação: ${selectedProblem?.descricao || ''} ${serviceName ? `- ${serviceName}` : ''} ${bairroName ? `em ${bairroName}` : ''}`;
      
      const aiResumo = `Análise técnica solicitada para ${selectedProblem?.descricao || ''} ${
        serviceName ? `relacionado a ${serviceName}` : ''
      } ${bairroName ? `na região de ${bairroName}` : ''}. ${
        formData.detalhes_solicitacao.substring(0, 100)
      }${formData.detalhes_solicitacao.length > 100 ? '...' : ''}`;
      
      const aiPerguntas = [
        `Qual é o prazo estimado para resolução deste problema de ${selectedProblem?.descricao || ''}?`,
        `Quais são os procedimentos técnicos necessários para esta situação?`,
        `Existe algum histórico similar para este tipo de ocorrência ${bairroName ? `em ${bairroName}` : ''}?`
      ];
      
      setFormData(prev => ({
        ...prev,
        titulo: aiTitle,
        resumo_situacao: aiResumo,
        perguntas: [
          aiPerguntas[0],
          aiPerguntas[1],
          aiPerguntas[2],
          '',
          ''
        ]
      }));
      
      toast({
        title: "Geração com IA falhou",
        description: "Foram utilizados templates padrão. Verifique e ajuste o conteúdo se necessário.",
        variant: "destructive"
      });
    }
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
    handleServiceSearch,
    generateAIContent
  };
};
