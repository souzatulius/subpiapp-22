
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { Search } from 'lucide-react';
import NotasList from './components/NotasList';
import NotaDetail from './components/NotaDetail';
import { LoadingState, EmptyState } from './components/NotasListStates';
import { NotaOficial } from './types';

interface AprovarNotaFormProps {
  onClose: () => void;
}

const AprovarNotaForm: React.FC<AprovarNotaFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [notas, setNotas] = useState<NotaOficial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchNotas = async () => {
    try {
      setIsLoading(true);
      // Buscar notas com join em autores, usando alias para evitar conflitos
      const { data: notasData, error: notasError } = await supabase
        .from('notas_oficiais')
        .select(`
          id, titulo, texto, status, criado_em, autor_id, aprovador_id, area_coordenacao_id, demanda_id, problema_id,
          autores:autor_id(id, nome_completo)
        `)
        .eq('status', 'pendente')  // Apenas notas pendentes
        .order('criado_em', { ascending: false });
      
      if (notasError) throw notasError;
      
      // Processar para adicionar informações de área
      const notasProcessadas = await Promise.all(notasData.map(async (nota) => {
        // Buscar área de coordenação
        let areaInfo = { descricao: 'Desconhecida', id: '' };
        if (nota.area_coordenacao_id) {
          const { data: areaData, error: areaError } = await supabase
            .from('areas_coordenacao')
            .select('id, descricao')
            .eq('id', nota.area_coordenacao_id)
            .single();
            
          if (!areaError && areaData) {
            areaInfo = { 
              descricao: areaData.descricao, 
              id: areaData.id 
            };
          }
        }
        
        return {
          ...nota,
          areas_coordenacao: areaInfo,
          autor: {
            id: nota.autores?.id,
            nome_completo: nota.autores?.nome_completo || 'Desconhecido'
          }
        };
      }));
      
      setNotas(notasProcessadas);
    } catch (error) {
      console.error('Erro ao carregar notas oficiais:', error);
      toast({
        title: "Erro ao carregar notas",
        description: "Não foi possível carregar as notas pendentes de aprovação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, []);

  const filteredNotas = notas.filter(nota => 
    nota.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (nota.areas_coordenacao?.descricao?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleApprove = async () => {
    if (!selectedNota) return;
    
    try {
      setIsApproving(true);
      
      // Update nota status to approved
      const { error: notaError } = await supabase
        .from('notas_oficiais')
        .update({ 
          status: 'aprovado',
          aprovador_id: user?.id,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', selectedNota.id);
      
      if (notaError) throw notaError;
      
      // Update demanda status if there is an associated demanda
      if (selectedNota.demanda_id) {
        const { error: demandaError } = await supabase
          .from('demandas')
          .update({ status: 'aprovada' })
          .eq('id', selectedNota.demanda_id);
        
        if (demandaError) throw demandaError;
      }
      
      toast({
        title: "Nota aprovada com sucesso!",
        description: "A nota oficial foi aprovada e está pronta para divulgação."
      });
      
      // Reset the selected nota and refresh the list
      setSelectedNota(null);
      fetchNotas();
    } catch (error: any) {
      console.error('Erro ao aprovar nota:', error);
      toast({
        title: "Erro ao aprovar nota",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedNota) return;
    
    try {
      setIsRejecting(true);
      
      // Update nota status to rejected
      const { error: notaError } = await supabase
        .from('notas_oficiais')
        .update({ 
          status: 'rejeitado',
          aprovador_id: user?.id,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', selectedNota.id);
      
      if (notaError) throw notaError;
      
      // Update demanda status if there is an associated demanda
      if (selectedNota.demanda_id) {
        const { error: demandaError } = await supabase
          .from('demandas')
          .update({ status: 'rejeitada' })
          .eq('id', selectedNota.demanda_id);
        
        if (demandaError) throw demandaError;
      }
      
      toast({
        title: "Nota rejeitada",
        description: "A nota oficial foi rejeitada e retornada para revisão."
      });
      
      // Reset the selected nota and refresh the list
      setSelectedNota(null);
      fetchNotas();
    } catch (error: any) {
      console.error('Erro ao rejeitar nota:', error);
      toast({
        title: "Erro ao rejeitar nota",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Aprovar Notas Oficiais</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!selectedNota ? (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título ou área..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {isLoading ? (
                <LoadingState />
              ) : filteredNotas.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotas.map(nota => (
                    <div 
                      key={nota.id}
                      className="border p-4 rounded-md cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedNota(nota)}
                    >
                      <h3 className="font-medium text-lg">{nota.titulo}</h3>
                      <div className="text-sm text-gray-500">
                        <p>Autor: {nota.autor?.nome_completo || 'Desconhecido'}</p>
                        <p>Área: {nota.areas_coordenacao?.descricao || 'Desconhecida'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </>
          ) : (
            <div>
              <Button variant="outline" className="mb-4" onClick={() => setSelectedNota(null)}>
                Voltar
              </Button>
              
              <div className="border p-6 rounded-md">
                <h2 className="text-xl font-bold mb-4">{selectedNota.titulo}</h2>
                <div className="mb-4">
                  <p><strong>Autor:</strong> {selectedNota.autor?.nome_completo || 'Desconhecido'}</p>
                  <p><strong>Área:</strong> {selectedNota.areas_coordenacao?.descricao || 'Desconhecida'}</p>
                </div>
                <div className="mb-6 whitespace-pre-line border-t pt-4">
                  {selectedNota.texto}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={isRejecting || isApproving}
                  >
                    {isRejecting ? "Rejeitando..." : "Rejeitar Nota"}
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isApproving ? "Aprovando..." : "Aprovar Nota"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AprovarNotaForm;
