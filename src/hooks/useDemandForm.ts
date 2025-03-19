import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface DemandFormData {
  titulo: string;
  area_coordenacao_id: string;
  servico_id: string;
  origem_id: string;
  tipo_midia_id: string;
  prioridade: string;
  prazo_resposta: string;
  nome_solicitante: string;
  telefone_solicitante: string;
  email_solicitante: string;
  endereco: string;
  bairro_id: string;
  perguntas: string[];
  detalhes_solicitacao: string;
  arquivo_url: string;
}

export const useDemandForm = (userId: string | undefined, onClose: () => void) => {
  const [formData, setFormData] = useState<DemandFormData>({
    titulo: '',
    area_coordenacao_id: '',
    servico_id: '',
    origem_id: '',
    tipo_midia_id: '',
    prioridade: 'média',
    prazo_resposta: '',
    nome_solicitante: '',
    telefone_solicitante: '',
    email_solicitante: '',
    endereco: '',
    bairro_id: '',
    perguntas: ['', '', '', '', ''],
    detalhes_solicitacao: '',
    arquivo_url: ''
  });

  const [areasCoord, setAreasCoord] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [origens, setOrigens] = useState<any[]>([]);
  const [tiposMidia, setTiposMidia] = useState<any[]>([]);
  const [distritos, setDistritos] = useState<any[]>([]);
  const [bairros, setBairros] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const [filteredServicos, setFilteredServicos] = useState<any[]>([]);
  const [filteredBairros, setFilteredBairros] = useState<any[]>([]);
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('*');
        if (areasError) throw areasError;
        setAreasCoord(areasData || []);

        const { data: servicosData, error: servicosError } = await supabase
          .from('servicos')
          .select('*');
        if (servicosError) throw servicosError;
        setServicos(servicosData || []);

        const { data: origensData, error: origensError } = await supabase
          .from('origens_demandas')
          .select('*');
        if (origensError) throw origensError;
        setOrigens(origensData || []);

        const { data: tiposMidiaData, error: tiposMidiaError } = await supabase
          .from('tipos_midia')
          .select('*');
        if (tiposMidiaError) throw tiposMidiaError;
        setTiposMidia(tiposMidiaData || []);

        const { data: distritosData, error: distritosError } = await supabase
          .from('distritos')
          .select('*');
        if (distritosError) throw distritosError;
        setDistritos(distritosData || []);

        const { data: bairrosData, error: bairrosError } = await supabase
          .from('bairros')
          .select('*');
        if (bairrosError) throw bairrosError;
        setBairros(bairrosData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as informações necessárias.",
          variant: "destructive"
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.area_coordenacao_id) {
      const filtered = servicos.filter(
        service => service.area_coordenacao_id === formData.area_coordenacao_id
      );
      setFilteredServicos(filtered);
    } else {
      setFilteredServicos([]);
    }
  }, [formData.area_coordenacao_id, servicos]);

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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (!userId) {
        throw new Error("Usuário não identificado. Por favor, faça login novamente.");
      }

      const filteredPerguntas = formData.perguntas.filter(p => p.trim() !== '');
      
      const demandaData = {
        ...formData,
        perguntas: filteredPerguntas.length > 0 ? filteredPerguntas : null,
        autor_id: userId,
        status: 'pendente'
      };

      console.log('Submitting demand data:', demandaData);

      const { data, error } = await supabase
        .from('demandas')
        .insert([demandaData])
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      toast({
        title: "Demanda cadastrada com sucesso!",
        description: "A solicitação foi registrada no sistema."
      });
      
      onClose();
    } catch (error: any) {
      console.error('Erro ao cadastrar demanda:', error);
      toast({
        title: "Erro ao cadastrar demanda",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (activeStep < 5) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return {
    formData,
    areasCoord,
    servicos,
    origens,
    tiposMidia,
    distritos,
    isLoading,
    serviceSearch,
    filteredServicesBySearch,
    filteredBairros,
    selectedDistrito,
    activeStep,
    handleChange,
    handleSelectChange,
    handleServiceSelect,
    handlePerguntaChange,
    handleSubmit,
    nextStep,
    prevStep,
    setSelectedDistrito
  };
};
