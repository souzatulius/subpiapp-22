
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
import LoadingSkeleton from './components/NotasListStates';

interface AprovarNotaFormProps {
  onClose: () => void;
}

type Nota = {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  autor: {
    nome_completo: string;
  } | null;
  area_coordenacao: {
    descricao: string;
  } | null;
  criado_em: string;
  demanda?: any;
};

const AprovarNotaForm: React.FC<AprovarNotaFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [notas, setNotas] = useState<Nota[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNota, setSelectedNota] = useState<Nota | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchNotas = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notas_oficiais')
        .select(`
          *,
          autor:autor_id(nome_completo),
          area_coordenacao:area_coordenacao_id(descricao),
          demanda:demanda_id(*)
        `)
        .eq('status', 'pendente')  // Only fetch pending notes
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      
      setNotas(data || []);
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
    nota.area_coordenacao?.descricao.toLowerCase().includes(searchTerm.toLowerCase())
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
      if (selectedNota.demanda) {
        const { error: demandaError } = await supabase
          .from('demandas')
          .update({ status: 'aprovada' })
          .eq('id', selectedNota.demanda.id);
        
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
      if (selectedNota.demanda) {
        const { error: demandaError } = await supabase
          .from('demandas')
          .update({ status: 'rejeitada' })
          .eq('id', selectedNota.demanda.id);
        
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
                <LoadingSkeleton />
              ) : (
                <NotasList 
                  notas={filteredNotas} 
                  onSelectNota={setSelectedNota} 
                  emptyMessage="Não há notas pendentes de aprovação."
                />
              )}
            </>
          ) : (
            <NotaDetail 
              nota={selectedNota}
              onBack={() => setSelectedNota(null)}
              footerActions={
                <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedNota(null)}
                  >
                    Voltar
                  </Button>
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
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AprovarNotaForm;
