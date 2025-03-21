
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, X, Upload, AlertCircle, Clock, Grid, List, Filter, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ResponderDemandaFormProps {
  onClose: () => void;
}

const ResponderDemandaForm: React.FC<ResponderDemandaFormProps> = ({
  onClose
}) => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [demandas, setDemandas] = useState<any[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<any[]>([]);
  const [selectedDemanda, setSelectedDemanda] = useState<any>(null);
  const [resposta, setResposta] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDemandas, setIsLoadingDemandas] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState<string>('');
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>('');
  const [areas, setAreas] = useState<{id: string, descricao: string}[]>([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const { data, error } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao')
          .order('descricao');
          
        if (error) throw error;
        setAreas(data || []);
      } catch (error) {
        console.error('Erro ao carregar áreas:', error);
      }
    };
    
    fetchAreas();
  }, []);

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoadingDemandas(true);
        const {
          data,
          error
        } = await supabase.from('demandas').select(`
            *,
            areas_coordenacao (id, descricao),
            origens_demandas (descricao),
            tipos_midia (descricao),
            servicos (descricao)
          `)
          .eq('status', 'pendente')
          .order('prioridade', {
            ascending: false
          })
          .order('prazo_resposta', {
            ascending: true
          });
          
        if (error) throw error;
        
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('demanda_id');
          
        if (notasError) throw notasError;
        
        const demandasComNotas = new Set(notasData?.map(nota => nota.demanda_id).filter(Boolean) || []);
        
        const filteredDemandas = data?.filter(demanda => !demandasComNotas.has(demanda.id)) || [];
        
        setDemandas(filteredDemandas);
        setFilteredDemandas(filteredDemandas);
      } catch (error) {
        console.error('Erro ao carregar demandas:', error);
        toast({
          title: "Erro ao carregar demandas",
          description: "Não foi possível carregar as demandas pendentes.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingDemandas(false);
      }
    };
    fetchDemandas();
  }, []);

  useEffect(() => {
    let filtered = [...demandas];
    
    if (areaFilter) {
      filtered = filtered.filter(demanda => demanda.areas_coordenacao?.id === areaFilter);
    }
    
    if (prioridadeFilter) {
      filtered = filtered.filter(demanda => demanda.prioridade === prioridadeFilter);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        demanda => demanda.titulo.toLowerCase().includes(searchLower) || 
                  demanda.areas_coordenacao?.descricao.toLowerCase().includes(searchLower) ||
                  demanda.servicos?.descricao?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredDemandas(filtered);
  }, [demandas, areaFilter, prioridadeFilter, searchTerm]);

  const handleSelectDemanda = (demanda: any) => {
    setSelectedDemanda(demanda);
  };
  
  const handleNavigateToConsultar = () => {
    navigate('/dashboard/comunicacao/consultar-demandas');
  };

  const handleSubmitResposta = async () => {
    if (!resposta.trim()) {
      toast({
        title: "Resposta não pode ser vazia",
        description: "Por favor, digite uma resposta para a demanda.",
        variant: "destructive"
      });
      return;
    }
    try {
      setIsLoading(true);

      const {
        error: respostaError
      } = await supabase.from('respostas_demandas').insert([{
        demanda_id: selectedDemanda.id,
        usuario_id: user?.id,
        texto: resposta
      }]);
      if (respostaError) throw respostaError;

      const {
        error: statusError
      } = await supabase.from('demandas').update({
        status: 'respondida'
      }).eq('id', selectedDemanda.id);
      if (statusError) throw statusError;
      
      toast({
        title: "Resposta enviada com sucesso!",
        description: "A demanda foi respondida e seu status foi atualizado."
      });

      setDemandas(demandas.filter(d => d.id !== selectedDemanda.id));
      setFilteredDemandas(filteredDemandas.filter(d => d.id !== selectedDemanda.id));
      setSelectedDemanda(null);
      setResposta('');
    } catch (error: any) {
      console.error('Erro ao enviar resposta:', error);
      toast({
        title: "Erro ao enviar resposta",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrioridade = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case 'alta':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">Alta</span>;
      case 'média':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Média</span>;
      case 'baixa':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Baixa</span>;
      default:
        return prioridade;
    }
  };

  const calcularTempoRestante = (prazo: string) => {
    const prazoDate = new Date(prazo);
    const agora = new Date();
    const diffMs = prazoDate.getTime() - agora.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHoras < 0) {
      return <span className="text-red-600 flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> Atrasado</span>;
    } else if (diffHoras < 24) {
      return <span className="text-orange-600 flex items-center"><Clock className="h-3 w-3 mr-1" /> {diffHoras}h restantes</span>;
    } else {
      const diffDias = Math.floor(diffHoras / 24);
      return <span className="text-green-600 flex items-center"><Clock className="h-3 w-3 mr-1" /> {diffDias}d restantes</span>;
    }
  };

  const renderFiltersBar = () => (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-gray-500" />
        <Input 
          type="text"
          placeholder="Buscar demandas..." 
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filtrar por área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as áreas</SelectItem>
            {areas.map(area => (
              <SelectItem key={area.id} value={area.id}>{area.descricao}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Qualquer prioridade</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="média">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="border rounded-md overflow-hidden flex">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'ghost'} 
            size="icon" 
            onClick={() => setViewMode('list')}
            className="h-10 w-10"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'cards' ? 'default' : 'ghost'} 
            size="icon" 
            onClick={() => setViewMode('cards')}
            className="h-10 w-10"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDemandasCards = () => {
    if (isLoadingDemandas) {
      return <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" />
        </div>;
    }
    
    if (filteredDemandas.length === 0) {
      return renderEmptyState();
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDemandas.map(demanda => (
          <Card 
            key={demanda.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedDemanda?.id === demanda.id ? 'border-2 border-[#003570]' : 'border border-gray-200'
            }`}
            onClick={() => handleSelectDemanda(demanda)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{demanda.titulo}</h3>
                <div className="flex space-x-2">
                  {formatPrioridade(demanda.prioridade)}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Área:</span>{' '}
                {demanda.areas_coordenacao?.descricao || 'Não informada'}
              </div>
              
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Origem:</span>{' '}
                {demanda.origens_demandas?.descricao || 'Não informada'}
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                <div>
                  {demanda.prazo_resposta && calcularTempoRestante(demanda.prazo_resposta)}
                </div>
                <div>
                  {demanda.prazo_resposta && format(new Date(demanda.prazo_resposta), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderDemandasList = () => {
    if (isLoadingDemandas) {
      return <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" />
        </div>;
    }
    if (filteredDemandas.length === 0) {
      return renderEmptyState();
    }
    return <div className="space-y-4">
        {filteredDemandas.map(demanda => <Card key={demanda.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedDemanda?.id === demanda.id ? 'border-2 border-[#003570]' : 'border border-gray-200'}`} onClick={() => handleSelectDemanda(demanda)}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{demanda.titulo}</h3>
                <div className="flex space-x-2">
                  {formatPrioridade(demanda.prioridade)}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Área:</span>{' '}
                {demanda.areas_coordenacao?.descricao || 'Não informada'}
              </div>
              
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Origem:</span>{' '}
                {demanda.origens_demandas?.descricao || 'Não informada'}
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                <div>
                  {demanda.prazo_resposta && calcularTempoRestante(demanda.prazo_resposta)}
                </div>
                <div>
                  {demanda.prazo_resposta && format(new Date(demanda.prazo_resposta), "dd/MM/yyyy 'às' HH:mm", {
                locale: ptBR
              })}
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>;
  };

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">✓</div>
      <h3 className="text-lg font-medium text-gray-900">Nenhuma demanda pendente</h3>
      <p className="mt-2 text-sm text-gray-500">
        Não há demandas pendentes para resposta com os filtros selecionados.
      </p>
      <div className="mt-6">
        <Button onClick={handleNavigateToConsultar} variant="outline">
          Consultar Todas as Demandas
        </Button>
      </div>
    </div>
  );

  const renderRespostaForm = () => {
    if (!selectedDemanda) return null;
    return <div className="animate-fade-in">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setSelectedDemanda(null)} className="p-1.5">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <h3 className="text-xl font-medium mt-4">{selectedDemanda.titulo}</h3>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Área de Coordenação</p>
              <p>{selectedDemanda.areas_coordenacao?.descricao || 'Não informada'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Serviço</p>
              <p>{selectedDemanda.servicos?.descricao || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Origem</p>
              <p>{selectedDemanda.origens_demandas?.descricao || 'Não informada'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Tipo de Mídia</p>
              <p>{selectedDemanda.tipos_midia?.descricao || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Prazo</p>
              <p>{selectedDemanda.prazo_resposta ? format(new Date(selectedDemanda.prazo_resposta), "dd/MM/yyyy 'às' HH:mm", {
                locale: ptBR
              }) : 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Prioridade</p>
              <p className="capitalize">{selectedDemanda.prioridade}</p>
            </div>
          </div>
          
          {selectedDemanda.perguntas && selectedDemanda.perguntas.length > 0 && <div className="mt-6">
              <p className="text-sm font-medium text-gray-500 mb-2">Perguntas</p>
              <ul className="list-disc pl-5 space-y-1">
                {selectedDemanda.perguntas.map((pergunta: string, index: number) => <li key={index} className="text-sm">{pergunta}</li>)}
              </ul>
            </div>}
          
          {selectedDemanda.detalhes_solicitacao && <div className="mt-6">
              <p className="text-sm font-medium text-gray-500 mb-2">Detalhes da Solicitação</p>
              <p className="text-sm whitespace-pre-line">{selectedDemanda.detalhes_solicitacao}</p>
            </div>}
          
          <div className="mt-8">
            <p className="text-sm font-medium text-gray-500 mb-2">Resposta</p>
            <Textarea value={resposta} onChange={e => setResposta(e.target.value)} placeholder="Digite sua resposta aqui..." rows={6} className="w-full" />
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="text-sm text-gray-500">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500">
                    <span>Anexar arquivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSubmitResposta} disabled={isLoading || !resposta.trim()} className="bg-[#003570] hover:bg-[#002855]">
              {isLoading ? "Enviando..." : "Enviar Resposta"}
            </Button>
          </div>
        </div>
      </div>;
  };

  return <div className="animate-fade-in">
      <Card className="border border-gray-200 mb-4">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-xl font-semibold text-[#003570] flex justify-between items-center">
            <span>Responder Demandas</span>
            <Button 
              variant="outline" 
              onClick={handleNavigateToConsultar}
              className="text-sm"
            >
              Consultar Outras Demandas
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!selectedDemanda && renderFiltersBar()}
          {selectedDemanda ? renderRespostaForm() : (
            viewMode === 'cards' ? renderDemandasCards() : renderDemandasList()
          )}
        </CardContent>
      </Card>
    </div>;
};

export default ResponderDemandaForm;
