
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';

interface CriarNotaFormProps {
  onClose: () => void;
}

const CriarNotaForm: React.FC<CriarNotaFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [areasCoord, setAreasCoord] = useState<any[]>([]);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [areaCoordId, setAreaCoordId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('notas_oficiais')
        .insert([{
          titulo,
          texto,
          area_coordenacao_id: areaCoordId,
          autor_id: user?.id,
          status: 'pendente'
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
          Criar Nota Oficial
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
        <CardContent className="p-6">
          <div className="space-y-6">
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
    </div>
  );
};

export default CriarNotaForm;
