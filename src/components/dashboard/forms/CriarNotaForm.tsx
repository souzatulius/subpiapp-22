
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, X, Search, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

interface CriarNotaFormProps {
  onClose: () => void;
}

interface Demand {
  id: string;
  titulo: string;
  status: string;
  area_coordenacao: {
    id: string;
    descricao: string;
  } | null;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null;
}

interface DemandResponse {
  demanda_id: string;
  texto: string;
}

const CriarNotaForm: React.FC<CriarNotaFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [demandas, setDemandas] = useState<Demand[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<Demand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDemandaId, setSelectedDemandaId] = useState('');
  const [selectedDemanda, setSelectedDemanda] = useState<Demand | null>(null);
  const [demandaResponse, setDemandaResponse] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'select-demand' | 'create-note'>('select-demand');

  // Fetch demandas
  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('demandas')
          .select(`
            id,
            titulo,
            status,
            detalhes_solicitacao,
            perguntas,
            area_coordenacao:area_coordenacao_id(id, descricao)
          `)
          .in('status', ['pendente', 'em_andamento'])
          .order('horario_publicacao', { ascending: false });
        
        if (error) throw error;
        setDemandas(data || []);
        setFilteredDemandas(data || []);
      } catch (error) {
        console.error('Erro ao carregar demandas:', error);
        toast({
          title: "Erro ao carregar demandas",
          description: "Não foi possível carregar as demandas disponíveis.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemandas();
  }, []);

  // Filter demandas based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDemandas(demandas);
      return;
    }
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const filtered = demandas.filter(demanda => 
      demanda.titulo.toLowerCase().includes(lowercaseSearchTerm) ||
      demanda.area_coordenacao?.descricao.toLowerCase().includes(lowercaseSearchTerm)
    );
    
    setFilteredDemandas(filtered);
  }, [searchTerm, demandas]);

  const fetchDemandResponse = async (demandaId: string) => {
    try {
      const { data, error } = await supabase
        .from('respostas_demandas')
        .select('*')
        .eq('demanda_id', demandaId)
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setDemandaResponse(data[0].texto);
      } else {
        setDemandaResponse(null);
      }
    } catch (error) {
      console.error('Erro ao carregar respostas da demanda:', error);
      toast({
        title: "Erro ao carregar respostas",
        description: "Não foi possível carregar as respostas da demanda.",
        variant: "destructive"
      });
    }
  };

  const handleDemandaSelect = (demandaId: string) => {
    setSelectedDemandaId(demandaId);
    
    // Find the selected demand
    const selected = demandas.find(d => d.id === demandaId);
    if (selected) {
      setSelectedDemanda(selected);
      // Fetch responses for this demand
      fetchDemandResponse(demandaId);
    }
    
    setStep('create-note');
  };

  const handleBackToSelection = () => {
    setStep('select-demand');
    setSelectedDemanda(null);
    setDemandaResponse(null);
  };

  const handleSubmit = async () => {
    // Validação
    if (!titulo.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, informe um título para a nota oficial.",
        variant: "destructive"
      });
      return;
    }

    if (!texto.trim()) {
      toast({
        title: "Conteúdo obrigatório",
        description: "Por favor, informe o conteúdo da nota oficial.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDemanda || !selectedDemanda.area_coordenacao) {
      toast({
        title: "Demanda inválida",
        description: "A demanda selecionada não possui área de coordenação.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('notas_oficiais')
        .insert([{
          titulo,
          texto,
          area_coordenacao_id: selectedDemanda.area_coordenacao.id,
          autor_id: user?.id,
          status: 'pendente',
          demanda_id: selectedDemandaId
        }])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Nota oficial criada com sucesso!",
        description: "A nota foi enviada para aprovação.",
      });
      
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar nota oficial:', error);
      toast({
        title: "Erro ao criar nota oficial",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format the responses text
  const formatResponses = (responseText: string | null) => {
    if (!responseText) return [];
    
    // Split by double newlines to get question-answer pairs
    const pairs = responseText.split('\n\n');
    return pairs.map(pair => {
      const lines = pair.split('\n');
      if (lines.length >= 2) {
        // Extract question and answer
        const question = lines[0].replace('Pergunta: ', '');
        const answer = lines[1].replace('Resposta: ', '');
        return { question, answer };
      }
      return { question: '', answer: '' };
    }).filter(qa => qa.question && qa.answer);
  };

  const formattedResponses = formatResponses(demandaResponse);

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
          {step === 'select-demand' ? 'Selecionar Demanda' : 'Criar Nota Oficial'}
        </h2>
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="p-1.5"
        >
          <X className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
      
      {step === 'select-demand' ? (
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Buscar demandas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <p>Carregando demandas...</p>
                </div>
              ) : filteredDemandas.length === 0 ? (
                <div className="py-8 flex justify-center">
                  <p>Nenhuma demanda encontrada</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {filteredDemandas.map((demanda) => (
                    <div
                      key={demanda.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleDemandaSelect(demanda.id)}
                    >
                      <h3 className="font-medium">{demanda.titulo}</h3>
                      <div className="flex gap-2 mt-2 text-sm text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                          {demanda.status === 'pendente' ? 'Pendente' : 'Em andamento'}
                        </span>
                        {demanda.area_coordenacao && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                            {demanda.area_coordenacao.descricao}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="space-y-6">
              <Button 
                variant="ghost" 
                onClick={handleBackToSelection}
                className="mb-2 -ml-2 text-gray-600"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar para seleção
              </Button>
              
              {selectedDemanda && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-lg">Informações da Demanda</h3>
                      <p className="text-sm text-gray-500">
                        {selectedDemanda.area_coordenacao?.descricao || 'Área não especificada'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Título da Demanda</h4>
                    <p>{selectedDemanda.titulo}</p>
                  </div>

                  {selectedDemanda.detalhes_solicitacao && (
                    <div>
                      <h4 className="font-medium">Detalhes da Solicitação</h4>
                      <p className="whitespace-pre-line">{selectedDemanda.detalhes_solicitacao}</p>
                    </div>
                  )}
                  
                  {selectedDemanda.perguntas && Object.keys(selectedDemanda.perguntas).length > 0 && (
                    <div>
                      <h4 className="font-medium">Perguntas</h4>
                      <div className="space-y-2 mt-2">
                        {Object.entries(selectedDemanda.perguntas).map(([key, question]) => (
                          <div key={key} className="bg-white p-3 rounded border">
                            <p className="font-medium">{question}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formattedResponses.length > 0 && (
                    <div>
                      <h4 className="font-medium">Respostas</h4>
                      <div className="space-y-3 mt-2">
                        {formattedResponses.map((resp, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <p className="font-medium">{resp.question}</p>
                            <Separator className="my-2" />
                            <p className="text-gray-700">{resp.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div>
                <Label htmlFor="titulo">Título da Nota Oficial</Label>
                <Input 
                  id="titulo" 
                  value={titulo} 
                  onChange={(e) => setTitulo(e.target.value)} 
                  placeholder="Informe um título claro e objetivo"
                />
              </div>
              
              <div>
                <Label htmlFor="texto">Texto da Nota Oficial</Label>
                <Textarea 
                  id="texto" 
                  value={texto} 
                  onChange={(e) => setTexto(e.target.value)} 
                  placeholder="Digite o conteúdo da nota oficial..."
                  rows={10}
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#003570] hover:bg-[#002855]"
                >
                  {isSubmitting ? "Enviando..." : "Enviar para Aprovação"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CriarNotaForm;
