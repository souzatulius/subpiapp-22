
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import NotasList from './components/NotasList';
import NotaDetail from './components/NotaDetail';
import { NotaOficial } from './types';

interface AprovarNotaFormProps {
  onClose: () => void;
}

const AprovarNotaForm: React.FC<AprovarNotaFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [notas, setNotas] = useState<NotaOficial[]>([]);
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkIsAdmin = async () => {
      try {
        if (user) {
          const { data, error } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          
          if (error) throw error;
          setIsAdmin(data || false);
        }
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        setIsAdmin(false);
      }
    };

    checkIsAdmin();
  }, [user]);

  // Fetch pending notes
  useEffect(() => {
    const fetchNotas = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select(`
            *,
            areas_coordenacao (descricao),
            autor:usuarios!notas_oficiais_autor_id_fkey (nome_completo)
          `)
          .eq('status', 'pendente')
          .order('criado_em', { ascending: false });
        
        if (error) throw error;
        
        // Properly cast the data to match the NotaOficial interface
        const typedData: NotaOficial[] = (data || []).map(item => ({
          id: item.id,
          titulo: item.titulo,
          texto: item.texto,
          autor_id: item.autor_id,
          criado_em: item.criado_em,
          status: item.status,
          area_coordenacao_id: item.area_coordenacao_id, // Add the missing property
          demanda_id: item.demanda_id,
          aprovador_id: item.aprovador_id,
          areas_coordenacao: item.areas_coordenacao,
          autor: item.autor
        }));
        
        setNotas(typedData);
      } catch (error) {
        console.error('Erro ao carregar notas:', error);
        toast({
          title: "Erro ao carregar notas",
          description: "Não foi possível carregar as notas pendentes.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchNotas();
    } else {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const handleSelectNota = (nota: NotaOficial) => {
    setSelectedNota(nota);
  };

  const handleAprovarRejeitar = async (status: 'aprovado' | 'rejeitado') => {
    if (!selectedNota) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('notas_oficiais')
        .update({ 
          status, 
          aprovador_id: user?.id,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', selectedNota.id);
      
      if (error) throw error;
      
      toast({
        title: status === 'aprovado' ? "Nota aprovada com sucesso!" : "Nota rejeitada",
        description: status === 'aprovado' ? 
          "A nota oficial foi aprovada e está pronta para publicação." : 
          "A nota oficial foi rejeitada.",
      });
      
      setNotas(notas.filter(n => n.id !== selectedNota.id));
      setSelectedNota(null);
      
    } catch (error: any) {
      console.error('Erro ao processar nota:', error);
      toast({
        title: "Erro ao processar nota",
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
          Aprovar Notas Oficiais
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
          {selectedNota ? (
            <NotaDetail
              nota={selectedNota}
              onBack={() => setSelectedNota(null)}
              onAprovar={() => handleAprovarRejeitar('aprovado')}
              onRejeitar={() => handleAprovarRejeitar('rejeitado')}
              isSubmitting={isSubmitting}
            />
          ) : (
            <NotasList
              notas={notas}
              selectedNota={selectedNota}
              onSelectNota={handleSelectNota}
              isAdmin={isAdmin}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AprovarNotaForm;
