
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CircleLoader } from 'react-spinners';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ESICProcesso, statusLabels, situacaoLabels } from '@/types/esic';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'novo_processo':
      return 'bg-blue-100 text-blue-800';
    case 'aguardando_justificativa':
      return 'bg-yellow-100 text-yellow-800';
    case 'aguardando_aprovacao':
      return 'bg-purple-100 text-purple-800';
    case 'concluido':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSituacaoColor = (situacao: string) => {
  switch (situacao) {
    case 'em_tramitacao':
      return 'bg-orange-100 text-orange-800';
    case 'prazo_prorrogado':
      return 'bg-red-100 text-red-800';
    case 'concluido':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const LatestESICProcesses: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: processos, isLoading, error } = useQuery({
    queryKey: ['latest-esic-processos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esic_processos')
        .select(`
          *,
          autor:usuarios(nome_completo)
        `)
        .order('criado_em', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching latest processos:', error);
        throw error;
      }
      
      const processedData = data.map((item: any) => ({
        id: item.id,
        data_processo: item.data_processo,
        situacao: item.situacao,
        status: item.status,
        texto: item.texto,
        autor_id: item.autor_id,
        criado_em: item.criado_em,
        atualizado_em: item.atualizado_em,
        autor: item.autor?.nome_completo ? { nome_completo: item.autor.nome_completo } : { nome_completo: 'Usuário' }
      }));

      return processedData as ESICProcesso[];
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const handleRowClick = (processo: ESICProcesso) => {
    navigate(`/dashboard/esic?view=${processo.id}`);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Últimos Processos e-SIC</span>
          <Badge 
            variant="outline" 
            className="ml-2 bg-blue-50"
            onClick={() => navigate('/dashboard/esic')}
          >
            Ver todos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <CircleLoader size={30} color="#003570" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            Erro ao carregar processos
          </div>
        ) : processos && processos.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processos.map((processo) => (
                  <TableRow 
                    key={processo.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(processo)}
                  >
                    <TableCell className="font-medium truncate max-w-[200px]">
                      {processo.texto.split('\n')[0]}
                    </TableCell>
                    <TableCell>
                      {format(new Date(processo.data_processo), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge className={getSituacaoColor(processo.situacao)}>
                        {situacaoLabels[processo.situacao]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(processo.status)}>
                        {statusLabels[processo.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhum processo cadastrado
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestESICProcesses;
