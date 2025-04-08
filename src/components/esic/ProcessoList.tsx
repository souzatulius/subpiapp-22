
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Clock, AlertCircle, SquareArrowOutUpRight } from 'lucide-react';

interface Processo {
  id: string;
  titulo: string;
  status: string;
  criado_em: string;
  prazo: string;
}

const ProcessoList: React.FC = () => {
  const navigate = useNavigate();

  const { data: processos, isLoading } = useQuery({
    queryKey: ['processos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('processos_esic')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw new Error(error.message);
      return data as Processo[];
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'andamento':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'atrasado':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'concluido':
        return 'Concluído';
      case 'andamento':
        return 'Em andamento';
      case 'atrasado':
        return 'Atrasado';
      default:
        return 'Desconhecido';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const handleProcessoClick = (id: string) => {
    navigate(`/esic/processo/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Processos Recentes</h2>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="andamento">Em andamento</TabsTrigger>
          <TabsTrigger value="concluido">Concluídos</TabsTrigger>
          <TabsTrigger value="atrasado">Atrasados</TabsTrigger>
        </TabsList>

        {['todos', 'andamento', 'concluido', 'atrasado'].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue}>
            <div className="space-y-2 mt-2">
              {processos && processos.length > 0 ? (
                processos
                  .filter(
                    (processo) => tabValue === 'todos' || processo.status === tabValue
                  )
                  .map((processo) => (
                    <div
                      key={processo.id}
                      className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition cursor-pointer relative"
                      onClick={() => handleProcessoClick(processo.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getStatusIcon(processo.status)}</div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{processo.titulo}</h3>
                          <div className="flex flex-wrap gap-x-4 text-sm text-gray-500 mt-1">
                            <span>
                              Status: <span className="font-medium">{getStatusText(processo.status)}</span>
                            </span>
                            <span>Criado: {formatDate(processo.criado_em)}</span>
                            <span>Prazo: {formatDate(processo.prazo)}</span>
                          </div>
                        </div>
                        <SquareArrowOutUpRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum processo encontrado
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProcessoList;
