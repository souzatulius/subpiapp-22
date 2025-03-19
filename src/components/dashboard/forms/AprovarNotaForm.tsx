
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, X, CheckCircle, XCircle, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AprovarNotaFormProps {
  onClose: () => void;
}

interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  autor_id: string;
  criado_em: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  areas_coordenacao?: {
    descricao: string;
  };
  autor?: {
    nome_completo: string;
  };
}

const AprovarNotaForm: React.FC<AprovarNotaFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [notas, setNotas] = useState<NotaOficial[]>([]);
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar se o usuário é admin
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

  // Buscar notas pendentes
  useEffect(() => {
    const fetchNotas = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select(`
            *,
            areas_coordenacao (descricao),
            autor:usuarios (nome_completo)
          `)
          .eq('status', 'pendente')
          .order('criado_em', { ascending: false });
        
        if (error) throw error;
        
        setNotas(data || []);
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
      
      // Atualizar lista de notas
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

  const renderNotasList = () => {
    if (!isAdmin) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-yellow-400 mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900">Acesso restrito</h3>
          <p className="mt-2 text-sm text-gray-500">
            Você não tem permissão para aprovar notas oficiais.
          </p>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" />
        </div>
      );
    }

    if (notas.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">✓</div>
          <h3 className="text-lg font-medium text-gray-900">Nenhuma nota pendente</h3>
          <p className="mt-2 text-sm text-gray-500">
            Não há notas oficiais pendentes para aprovação.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {notas.map((nota) => (
          <Card 
            key={nota.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedNota?.id === nota.id ? 'border-2 border-[#003570]' : 'border border-gray-200'
            }`}
            onClick={() => handleSelectNota(nota)}
          >
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">{nota.titulo}</h3>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <User className="h-3 w-3 mr-1" />
                <span>{nota.autor?.nome_completo || 'Autor desconhecido'}</span>
              </div>
              
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Área:</span>{' '}
                {nota.areas_coordenacao?.descricao || 'Não informada'}
              </div>
              
              <div className="text-sm text-gray-500">
                <span className="font-medium">Criada em:</span>{' '}
                {nota.criado_em ? format(
                  new Date(nota.criado_em), 
                  "dd/MM/yyyy 'às' HH:mm", 
                  { locale: ptBR }
                ) : 'Data desconhecida'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderNotaDetail = () => {
    if (!selectedNota) return null;

    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedNota(null)}
            className="p-1.5"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          
          <div className="mt-4">
            <h3 className="text-xl font-medium">{selectedNota.titulo}</h3>
            
            <div className="mt-2 text-sm text-gray-500">
              <div className="flex items-center mb-1">
                <User className="h-4 w-4 mr-1" />
                <span>{selectedNota.autor?.nome_completo || 'Autor desconhecido'}</span>
              </div>
              
              <div className="mb-1">
                <span className="font-medium">Área:</span>{' '}
                {selectedNota.areas_coordenacao?.descricao || 'Não informada'}
              </div>
              
              <div>
                <span className="font-medium">Criada em:</span>{' '}
                {selectedNota.criado_em ? format(
                  new Date(selectedNota.criado_em), 
                  "dd/MM/yyyy 'às' HH:mm", 
                  { locale: ptBR }
                ) : 'Data desconhecida'}
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t pt-4">
            <div className="text-sm whitespace-pre-line">{selectedNota.texto}</div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <Button 
              variant="outline"
              onClick={() => handleAprovarRejeitar('rejeitado')}
              disabled={isSubmitting}
              className="flex items-center"
            >
              <XCircle className="h-4 w-4 mr-2 text-red-500" />
              Rejeitar
            </Button>
            
            <Button 
              onClick={() => handleAprovarRejeitar('aprovado')}
              disabled={isSubmitting}
              className="bg-[#003570] hover:bg-[#002855] flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Aprovar
            </Button>
          </div>
        </div>
      </div>
    );
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
          {selectedNota ? renderNotaDetail() : renderNotasList()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AprovarNotaForm;
