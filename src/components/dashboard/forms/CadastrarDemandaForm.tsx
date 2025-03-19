
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, X, Upload, Briefcase, Book, Users, Mail, Heart, Home, Code, Lightbulb, LayoutDashboard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CadastrarDemandaFormProps {
  onClose: () => void;
}

interface FormStep {
  title: string;
  description: string;
}

const CadastrarDemandaForm: React.FC<CadastrarDemandaFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [areasCoord, setAreasCoord] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [origens, setOrigens] = useState<any[]>([]);
  const [tiposMidia, setTiposMidia] = useState<any[]>([]);
  const [distritos, setDistritos] = useState<any[]>([]);
  const [bairros, setBairros] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
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

  const [filteredServicos, setFilteredServicos] = useState<any[]>([]);
  const [filteredBairros, setFilteredBairros] = useState<any[]>([]);
  const [selectedDistrito, setSelectedDistrito] = useState('');
  
  const steps: FormStep[] = [
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
      title: "Perguntas e Detalhes",
      description: "Adicione perguntas e detalhes adicionais"
    }
  ];

  // Map ícones para áreas de coordenação
  const getAreaIcon = (descricao: string) => {
    const iconMap: {[key: string]: React.ReactNode} = {
      "Administrativa": <Briefcase className="h-6 w-6" />,
      "Educação": <Book className="h-6 w-6" />,
      "Saúde": <Heart className="h-6 w-6" />,
      "Comunicação": <Mail className="h-6 w-6" />,
      "Habitação": <Home className="h-6 w-6" />,
      "Tecnologia": <Code className="h-6 w-6" />,
      "Inovação": <Lightbulb className="h-6 w-6" />,
      "Social": <Users className="h-6 w-6" />
    };

    return iconMap[descricao] || <LayoutDashboard className="h-6 w-6" />;
  };

  // Fetch data from Supabase tables
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch areas de coordenação
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('*');
        
        if (areasError) throw areasError;
        setAreasCoord(areasData || []);

        // Fetch serviços
        const { data: servicosData, error: servicosError } = await supabase
          .from('servicos')
          .select('*');
        
        if (servicosError) throw servicosError;
        setServicos(servicosData || []);

        // Fetch origens
        const { data: origensData, error: origensError } = await supabase
          .from('origens_demandas')
          .select('*');
        
        if (origensError) throw origensError;
        setOrigens(origensData || []);

        // Fetch tipos midia
        const { data: tiposMidiaData, error: tiposMidiaError } = await supabase
          .from('tipos_midia')
          .select('*');
        
        if (tiposMidiaError) throw tiposMidiaError;
        setTiposMidia(tiposMidiaData || []);

        // Fetch distritos
        const { data: distritosData, error: distritosError } = await supabase
          .from('distritos')
          .select('*');
        
        if (distritosError) throw distritosError;
        setDistritos(distritosData || []);

        // Fetch bairros
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

  // Filter serviços baseado na área de coordenação selecionada
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

  // Filter bairros baseado no distrito selecionado
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePerguntaChange = (index: number, value: string) => {
    const updatedPerguntas = [...formData.perguntas];
    updatedPerguntas[index] = value;
    setFormData(prev => ({ ...prev, perguntas: updatedPerguntas }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Filter out empty perguntas
      const filteredPerguntas = formData.perguntas.filter(p => p.trim() !== '');
      
      const demandaData = {
        ...formData,
        perguntas: filteredPerguntas.length > 0 ? filteredPerguntas : null,
        autor_id: user?.id,
        status: 'pendente'
      };
      
      const { data, error } = await supabase
        .from('demandas')
        .insert([demandaData])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Demanda cadastrada com sucesso!",
        description: "A solicitação foi registrada no sistema.",
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
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Identificação da Demanda
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título da Demanda</Label>
              <Input 
                id="titulo" 
                name="titulo" 
                value={formData.titulo} 
                onChange={handleChange} 
                placeholder="Digite um título descritivo"
              />
            </div>
            
            <div>
              <Label className="block mb-2">Área de Coordenação</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {areasCoord.map(area => (
                  <Button
                    key={area.id}
                    type="button"
                    variant={formData.area_coordenacao_id === area.id ? "default" : "outline"}
                    className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${
                      formData.area_coordenacao_id === area.id ? "ring-2 ring-[#003570]" : ""
                    }`}
                    onClick={() => handleSelectChange('area_coordenacao_id', area.id)}
                  >
                    {getAreaIcon(area.descricao)}
                    <span className="text-xs font-medium">{area.descricao}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {formData.area_coordenacao_id && (
              <div className="animate-fadeIn">
                <Label htmlFor="servico_id">Serviço Relacionado</Label>
                <Select 
                  value={formData.servico_id} 
                  onValueChange={(value) => handleSelectChange('servico_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredServicos.map(servico => (
                      <SelectItem key={servico.id} value={servico.id}>
                        {servico.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );
      
      case 1: // Origem e Classificação
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="origem_id">Origem da Demanda</Label>
              <Select 
                value={formData.origem_id} 
                onValueChange={(value) => handleSelectChange('origem_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  {origens.map(origem => (
                    <SelectItem key={origem.id} value={origem.id}>
                      {origem.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tipo_midia_id">Tipo de Mídia</Label>
              <Select 
                value={formData.tipo_midia_id} 
                onValueChange={(value) => handleSelectChange('tipo_midia_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de mídia" />
                </SelectTrigger>
                <SelectContent>
                  {tiposMidia.map(tipo => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 2: // Prioridade e Prazo
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="prioridade" className="block mb-2">Prioridade</Label>
              <RadioGroup 
                value={formData.prioridade} 
                onValueChange={(value) => handleSelectChange('prioridade', value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alta" id="alta" />
                  <Label htmlFor="alta" className="text-red-600 font-medium">Alta</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="média" id="media" />
                  <Label htmlFor="media" className="text-yellow-600 font-medium">Média</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="baixa" id="baixa" />
                  <Label htmlFor="baixa" className="text-green-600 font-medium">Baixa</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="prazo_resposta">Prazo para Resposta</Label>
              <Input 
                id="prazo_resposta" 
                name="prazo_resposta" 
                type="datetime-local" 
                value={formData.prazo_resposta} 
                onChange={handleChange} 
              />
            </div>
          </div>
        );
      
      case 3: // Dados do Solicitante
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome_solicitante">Nome do Solicitante</Label>
              <Input 
                id="nome_solicitante" 
                name="nome_solicitante" 
                value={formData.nome_solicitante} 
                onChange={handleChange} 
                placeholder="Nome completo"
              />
            </div>
            
            <div>
              <Label htmlFor="telefone_solicitante">Telefone</Label>
              <Input 
                id="telefone_solicitante" 
                name="telefone_solicitante" 
                value={formData.telefone_solicitante} 
                onChange={handleChange} 
                placeholder="(11) 00000-0000"
              />
            </div>
            
            <div>
              <Label htmlFor="email_solicitante">E-mail</Label>
              <Input 
                id="email_solicitante" 
                name="email_solicitante" 
                type="email" 
                value={formData.email_solicitante} 
                onChange={handleChange} 
                placeholder="email@exemplo.com"
              />
            </div>
          </div>
        );
      
      case 4: // Localização
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input 
                id="endereco" 
                name="endereco" 
                value={formData.endereco} 
                onChange={handleChange} 
                placeholder="Endereço completo"
              />
            </div>
            
            <div>
              <Label htmlFor="distrito">Distrito</Label>
              <Select 
                value={selectedDistrito} 
                onValueChange={setSelectedDistrito}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o distrito" />
                </SelectTrigger>
                <SelectContent>
                  {distritos.map(distrito => (
                    <SelectItem key={distrito.id} value={distrito.id}>
                      {distrito.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="bairro_id">Bairro</Label>
              <Select 
                value={formData.bairro_id} 
                onValueChange={(value) => handleSelectChange('bairro_id', value)}
                disabled={!selectedDistrito}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o bairro" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBairros.map(bairro => (
                    <SelectItem key={bairro.id} value={bairro.id}>
                      {bairro.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 5: // Perguntas e Detalhes
        return (
          <div className="space-y-4">
            <div>
              <Label>Perguntas (até 5)</Label>
              {formData.perguntas.map((pergunta, index) => (
                <Input 
                  key={index}
                  className="mt-2"
                  value={pergunta} 
                  onChange={(e) => handlePerguntaChange(index, e.target.value)} 
                  placeholder={`Pergunta ${index + 1}`}
                />
              ))}
            </div>
            
            <div>
              <Label htmlFor="detalhes_solicitacao">Detalhes da Solicitação</Label>
              <Textarea 
                id="detalhes_solicitacao" 
                name="detalhes_solicitacao" 
                value={formData.detalhes_solicitacao} 
                onChange={handleChange} 
                placeholder="Forneça detalhes adicionais (máx. 500 caracteres)"
                maxLength={500}
                rows={4}
              />
            </div>
            
            <div>
              <Label>Anexar Arquivo</Label>
              <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500">
                      <span>Clique para anexar um arquivo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF até 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="p-1.5"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <h2 className="text-xl font-semibold text-[#003570]">
          Cadastrar Nova Solicitação
        </h2>
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="p-1.5"
        >
          <X className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
      
      <Card className="border border-gray-200">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">
              {steps[activeStep].title}
            </h3>
            <p className="text-sm text-gray-500">
              {steps[activeStep].description}
            </p>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
                <div 
                  className="bg-[#003570] transition-all"
                  style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between">
                {steps.map((_, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-center rounded-full transition-colors 
                      ${index <= activeStep ? 'bg-[#003570] text-white' : 'bg-gray-200 text-gray-400'}
                      h-6 w-6 text-xs`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={activeStep === 0}
            >
              Voltar
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#003570] hover:bg-[#002855]"
              >
                {isLoading ? "Enviando..." : "Finalizar"}
              </Button>
            ) : (
              <Button 
                onClick={nextStep}
                className="bg-[#003570] hover:bg-[#002855]"
              >
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CadastrarDemandaForm;
