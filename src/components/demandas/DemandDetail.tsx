import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileEdit, CheckCircle, X, FileText, LucideEdit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useUserProfiles } from '@/hooks/useUserProfiles';
import { NotaOficial } from '@/types/nota';
import { ensureNotaCompat } from '@/components/consultar-notas/NotaCompat';

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Data não informada';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  } catch (e) {
    return 'Data inválida';
  }
};

interface DemandDetailProps {
  demand: any;
  isOpen: boolean;
  onClose: () => void;
}

const DemandDetail: React.FC<DemandDetailProps> = ({ demand, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { profiles } = useUserProfiles();
  const [activeTab, setActiveTab] = useState('details');
  const [responseData, setResponseData] = useState<any>(null);
  const [nota, setNota] = useState<NotaOficial | null>(null);
  const [isUpdatingNota, setIsUpdatingNota] = useState(false);

  useEffect(() => {
    if (demand?.id) {
      fetchResponseData(demand.id);
      fetchNota(demand.id);
    }
  }, [demand]);

  const fetchResponseData = async (demandId: string) => {
    try {
      const { data, error } = await supabase
        .from('respostas_demandas')
        .select('*')
        .eq('demanda_id', demandId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching response data:', error);
        return;
      }

      setResponseData(data);
    } catch (error) {
      console.error('Error in fetchResponseData:', error);
    }
  };

  const fetchNota = async (demandId: string) => {
    try {
      const { data, error } = await supabase
        .from('notas_oficiais')
        .select(`
          *,
          autor:autor_id(id, nome_completo),
          aprovador:aprovador_id(id, nome_completo),
          problema:problema_id(
            id,
            descricao,
            coordenacao:coordenacao_id(id, descricao)
          )
        `)
        .eq('demanda_id', demandId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching nota:', error);
        return;
      }

      if (data) {
        const notaData = ensureNotaCompat(data as unknown as NotaOficial);
        setNota(notaData);
      } else {
        setNota(null);
      }
    } catch (error) {
      console.error('Error in fetchNota:', error);
    }
  };

  const handleCreateNota = () => {
    navigate(`/dashboard/comunicacao/notas/criar?id=${demand.id}`);
  };

  const handleEditNota = () => {
    navigate(`/dashboard/comunicacao/notas/editar?id=${nota?.id}`);
  };

  const handleViewNota = () => {
    navigate(`/dashboard/comunicacao/notas/visualizar?id=${nota?.id}`);
  };

  const updateNotaStatus = async (status: string) => {
    if (!nota) return;
    
    setIsUpdatingNota(true);
    try {
      const { error } = await supabase
        .from('notas_oficiais')
        .update({ 
          status: status,
          aprovador_id: status === 'aprovada' ? profiles[0]?.id : null
        })
        .eq('id', nota.id);

      if (error) throw error;

      toast({
        title: `Nota ${status === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`,
        description: status === 'aprovada' 
          ? "A nota foi aprovada e está pronta para publicação."
          : "A nota foi rejeitada e o autor será notificado."
      });

      fetchNota(demand.id);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar nota",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingNota(false);
    }
  };

  if (!demand) return null;

  const formatResponseData = () => {
    if (!responseData || !responseData.texto) return [];
    
    const lines = responseData.texto.split('\n\n');
    return lines.map(line => {
      const parts = line.split('\n');
      if (parts.length >= 2) {
        return {
          question: parts[0].replace('Pergunta: ', ''),
          answer: parts[1].replace('Resposta: ', '')
        };
      }
      return null;
    }).filter(Boolean);
  };

  const formattedResponses = formatResponseData();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{demand.titulo}</DialogTitle>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={
              demand.status === 'pendente' ? 'destructive' :
              demand.status === 'em_andamento' ? 'warning' :
              demand.status === 'respondida' || demand.status === 'aguardando_nota' ? 'default' :
              'success'
            }>
              {demand.status}
            </Badge>
            <span className="text-sm text-gray-500">
              Prioridade: <Badge variant="outline">{demand.prioridade}</Badge>
            </span>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="responses" disabled={!formattedResponses.length}>
              Respostas
            </TabsTrigger>
            <TabsTrigger value="nota" disabled={!nota}>
              Nota Oficial
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Solicitante</h4>
                  <p className="text-sm text-gray-500">{demand.nome_solicitante || 'Não informado'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm text-gray-500">{demand.email_solicitante || 'Não informado'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Telefone</h4>
                  <p className="text-sm text-gray-500">{demand.telefone_solicitante || 'Não informado'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Veículo de Imprensa</h4>
                  <p className="text-sm text-gray-500">{demand.veiculo_imprensa || 'Não informado'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Endereço</h4>
                <p className="text-sm text-gray-500">{demand.endereco || 'Não informado'}</p>
              </div>
              
              <div>
                <h4 className="font-medium">Detalhes da Solicitação</h4>
                <p className="text-sm text-gray-500">{demand.detalhes_solicitacao || 'Não informado'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Bairro</h4>
                  <p className="text-sm text-gray-500">{demand.bairro?.nome || 'Não informado'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Data de Publicação</h4>
                  <p className="text-sm text-gray-500">{formatDate(demand.horario_publicacao)}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="responses" className="space-y-4 mt-4">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Respostas da Demanda</h3>
              
              {formattedResponses.length > 0 ? (
                formattedResponses.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="font-medium">{item.question}</div>
                    <div className="text-gray-700">{item.answer}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Nenhuma resposta encontrada para esta demanda.</p>
              )}

              {responseData?.comentarios && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Comentários:</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{responseData.comentarios}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="nota" className="space-y-4 mt-4">
            {nota ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{nota.titulo}</h3>
                  <Badge>{nota.status}</Badge>
                </div>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <div>Autor: {nota.autor?.nome_completo || 'Não informado'}</div>
                  <div>Criado em: {formatDate(nota.criado_em)}</div>
                  {nota.aprovador && (
                    <div>Aprovado por: {nota.aprovador?.nome_completo || 'Não informado'}</div>
                  )}
                </div>
                
                <div className="prose max-w-none border-t pt-4 mt-4">
                  <div 
                    className="whitespace-pre-wrap text-gray-700"
                    dangerouslySetInnerHTML={{ __html: (nota.texto || nota.conteudo).replace(/\n/g, '<br/>') }}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleViewNota}
                  >
                    <Eye className="h-4 w-4 mr-2" /> Visualizar
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleEditNota}
                  >
                    <LucideEdit className="h-4 w-4 mr-2" /> Editar
                  </Button>
                  
                  {nota.status === 'pendente' && (
                    <>
                      <Button 
                        variant="destructive" 
                        onClick={() => updateNotaStatus('rejeitada')}
                        disabled={isUpdatingNota}
                      >
                        <X className="h-4 w-4 mr-2" /> Recusar
                      </Button>
                      
                      <Button 
                        variant="default" 
                        onClick={() => updateNotaStatus('aprovada')}
                        disabled={isUpdatingNota}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> Aprovar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma nota oficial encontrada para esta demanda.</p>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center">
          <div>
            {(demand.status === 'respondida' || demand.status === 'aguardando_nota') && !nota && (
              <Button 
                onClick={handleCreateNota}
                className="flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                Gerar Nota Oficial
              </Button>
            )}
          </div>
          
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DemandDetail;
