
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, X, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';

interface CriarNotaFormProps {
  onClose: () => void;
}

interface Demand {
  id: string;
  titulo: string;
  status: string;
  area_coordenacao: {
    descricao: string;
  } | null;
}

const CriarNotaForm: React.FC<CriarNotaFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [areasCoord, setAreasCoord] = useState<any[]>([]);
  const [demandas, setDemandas] = useState<Demand[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<Demand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDemandaId, setSelectedDemandaId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [areaCoordId, setAreaCoordId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'select-demand' | 'create-note'>('select-demand');

  // Fetch areas de coordenação
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('areas_coordenacao')
          .select('*')
          .order('descricao');
        
        if (error) throw error;
        setAreasCoord(data || []);
      } catch (error) {
        console.error('Erro ao carregar áreas de coordenação:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as áreas de coordenação.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAreas();
  }, []);

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
            area_coordenacao:area_coordenacao_id(descricao)
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

  const handleDemandaSelect = (demandaId: string) => {
    setSelectedDemandaId(demandaId);
    
    // Find the selected demand to pre-fill area
    const selectedDemanda = demandas.find(d => d.id === demandaId);
    if (selectedDemanda && selectedDemanda.area_coordenacao) {
      // Find the area id based on the description
      const area = areasCoord.find(a => 
        a.descricao === selectedDemanda.area_coordenacao.descricao
      );
      if (area) {
        setAreaCoordId(area.id);
      }
    }
    
    setStep('create-note');
  };

  const handleBackToSelection = () => {
    setStep('select-demand');
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

    if (!areaCoordId) {
      toast({
        title: "Área de coordenação obrigatória",
        description: "Por favor, selecione uma área de coordenação.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDemandaId) {
      toast({
        title: "Demanda obrigatória",
        description: "Por favor, selecione uma demanda para associar à nota oficial.",
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
          area_coordenacao_id: areaCoordId,
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
                <Label htmlFor="area">Área de Coordenação</Label>
                <Select 
                  value={areaCoordId} 
                  onValueChange={setAreaCoordId}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areasCoord.map(area => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
