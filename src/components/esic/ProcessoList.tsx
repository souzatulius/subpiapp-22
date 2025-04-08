
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare, FilePlus, PenLine, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { ESICProcesso } from '@/types/esic';

interface ProcessoListProps {
  searchTerm?: string;
  onAddJustificativa?: (processoId: string, processoTexto: string) => void;
  onViewClick?: (processo: ESICProcesso) => void;
  onEditClick?: (processo: ESICProcesso) => void;
  onDeleteClick?: (processo: ESICProcesso) => void;
}

const ProcessoList: React.FC<ProcessoListProps> = ({
  searchTerm = '',
  onAddJustificativa,
  onViewClick,
  onEditClick,
  onDeleteClick
}) => {
  const { user } = useAuth();
  const [processos, setProcessos] = useState<ESICProcesso[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to format status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'bg-green-500';
      case 'em_andamento': return 'bg-blue-500';
      case 'concluido': return 'bg-gray-500';
      case 'cancelado': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching ESIC processos...');
        
        const { data, error } = await supabase
          .from('esic_processos')
          .select(`
            *,
            autor:usuarios(nome_completo)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching ESIC processos:', error);
          throw error;
        }
        
        console.log('ESIC processos fetched:', data);
        
        // Cast the data to the correct type, handling the autor relationship
        const formattedProcessos = data.map((processo: any) => {
          // Handle the case where autor is null or not properly fetched
          const autorNome = processo.autor?.nome_completo || 'Usuário';
          
          return {
            ...processo,
            autor_nome: autorNome,
            // Ensure status is one of the allowed values
            status: ['aberto', 'em_andamento', 'concluido', 'cancelado'].includes(processo.status) 
              ? processo.status 
              : 'aberto'
          } as ESICProcesso;
        });
        
        setProcessos(formattedProcessos);
      } catch (error) {
        console.error('Error fetching processos:', error);
        toast({
          title: 'Erro ao carregar processos',
          description: 'Não foi possível carregar a lista de processos.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProcessos();
  }, []);

  // Filter processos based on search term
  const filteredProcessos = processos.filter(processo => {
    return processo.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
           processo.protocolo.toString().includes(searchTerm.toLowerCase()) ||
           (processo.solicitante?.toLowerCase() || '').includes(searchTerm.toLowerCase());
  });

  const handleAddJustificativa = (processo: ESICProcesso) => {
    if (onAddJustificativa) {
      onAddJustificativa(processo.id, processo.assunto);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-md p-4 animate-pulse">
            <div className="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredProcessos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FilePlus className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">Nenhum processo encontrado</h3>
        <p className="text-gray-500 mb-4">
          {searchTerm ? 'Tente ajustar os critérios de busca' : 'Não há processos cadastrados'}
        </p>
        <Button onClick={() => navigate('/dashboard/esic?screen=create')}>
          <FilePlus className="h-4 w-4 mr-2" />
          Novo Processo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredProcessos.map((processo) => (
        <div key={processo.id} className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <div>
              <h3 className="font-medium text-gray-900">{processo.assunto}</h3>
              <div className="text-gray-500 text-sm">
                <span>Protocolo: {processo.protocolo}</span>
                {processo.solicitante && (
                  <span className="ml-4">Solicitante: {processo.solicitante}</span>
                )}
              </div>
            </div>
            <div className="flex mt-2 md:mt-0">
              <Badge className={getStatusColor(processo.status)}>
                {processo.status === 'aberto' && 'Aberto'}
                {processo.status === 'em_andamento' && 'Em andamento'}
                {processo.status === 'concluido' && 'Concluído'}
                {processo.status === 'cancelado' && 'Cancelado'}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row mt-2 space-y-2 sm:space-y-0 sm:space-x-2 justify-between items-start sm:items-center">
            <div className="text-gray-500 text-sm">
              Criado em {format(new Date(processo.criado_em), 'dd/MM/yyyy')}
              {processo.autor_nome && <span> por {processo.autor_nome}</span>}
            </div>
            
            <div className="flex space-x-2">
              {onViewClick && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onViewClick(processo)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Visualizar
                </Button>
              )}
              
              {onAddJustificativa && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleAddJustificativa(processo)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Justificativa
                </Button>
              )}
              
              {onEditClick && processo.status !== 'concluido' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEditClick(processo)}
                >
                  <PenLine className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
              
              {onDeleteClick && processo.status !== 'concluido' && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onDeleteClick(processo)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessoList;
