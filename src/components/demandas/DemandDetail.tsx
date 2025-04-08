
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Eye, 
  MessageSquare, 
  FileEdit, 
  CheckCircle, 
  X, 
  FileText, 
  LucideEdit, 
  Clock, 
  MapPin,
  Tag
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useUserProfiles } from '@/hooks/useUserProfiles';
import { NotaOficial } from '@/types/nota';
import { ensureNotaCompat } from '@/components/consultar-notas/NotaCompat';
import { DemandaStatusBadge } from '@/components/ui/status-badge';
import { formatPriority } from '@/utils/priorityUtils';

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
        .maybeSingle();

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

  const handleRespondToDemand = () => {
    navigate(`/dashboard/comunicacao/responder?id=${demand.id}`);
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
    if (!responseData || !responseData.respostas) return [];
    
    try {
      // Check if respostas is a string and parse it
      const respostasData = typeof responseData.respostas === 'string' 
        ? JSON.parse(responseData.respostas) 
        : responseData.respostas;
      
      // Format the QA pairs
      const qaResults = [];
      const perguntas = demand.perguntas ? (
        typeof demand.perguntas === 'string' 
          ? JSON.parse(demand.perguntas) 
          : demand.perguntas
      ) : {};
      
      // Handle different formats of perguntas (array or object)
      if (Array.isArray(perguntas)) {
        perguntas.forEach((pergunta, index) => {
          if (pergunta && respostasData[index] !== undefined) {
            qaResults.push({
              question: pergunta,
              answer: respostasData[index]
            });
          }
        });
      } else {
        // If perguntas is an object with keys
        Object.keys(perguntas).forEach(key => {
          if (perguntas[key] && respostasData[key] !== undefined) {
            qaResults.push({
              question: perguntas[key],
              answer: respostasData[key]
            });
          }
        });
      }
      
      return qaResults;
    } catch (e) {
      console.error('Error formatting response data:', e);
      return [];
    }
  };

  const formattedResponses = formatResponseData();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{demand.titulo}</DialogTitle>
          <div className="flex items-center flex-wrap gap-2 mt-2">
            <DemandaStatusBadge status={demand.status} />
            
            <Badge 
              variant="outline" 
              className={`font-medium ${
                demand.prioridade === 'alta' ? 'bg-red-50 text-red-700 border-red-200' : 
                demand.prioridade === 'media' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                'bg-green-50 text-green-700 border-green-200'
              }`}
            >
              Prioridade: {formatPriority(demand.prioridade)}
            </Badge>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="responses">
              Respostas {formattedResponses.length ? `(${formattedResponses.length})` : ''}
            </TabsTrigger>
            <TabsTrigger value="nota" disabled={!nota}>
              Nota Oficial
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Tema e Serviço */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start gap-2">
                  <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-700">Tema/Problema</h4>
                    <p className="text-sm text-gray-600">{demand.problema?.descricao || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-700">Serviço</h4>
                    <p className="text-sm text-gray-600">{demand.servico?.descricao || 'Não informado'}</p>
                  </div>
                </div>
              </div>
              
              {/* Protocolo e Prazos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                {demand.protocolo && (
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-700">Protocolo 156</h4>
                      <p className="text-sm text-gray-600">{demand.protocolo}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-700">Prazo para Resposta</h4>
                    <p className="text-sm text-gray-600 font-medium">
                      {formatDate(demand.prazo_resposta)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Solicitante */}
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
              
              {/* Localização */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" /> Localização
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Endereço: {demand.endereco || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bairro: {demand.bairro?.nome || 'Não informado'}</p>
                  </div>
                  {demand.distrito && (
                    <div>
                      <p className="text-sm text-gray-500">Distrito: {demand.distrito.nome || 'Não informado'}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Detalhes da Solicitação</h4>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{demand.detalhes_solicitacao || 'Não informado'}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="responses" className="space-y-4 mt-4">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Respostas da Demanda</h3>
                {(demand.status === 'pendente' || demand.status === 'em_andamento') && (
                  <Button onClick={handleRespondToDemand} className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Responder Perguntas
                  </Button>
                )}
              </div>
              
              {formattedResponses.length > 0 ? (
                <div className="space-y-4">
                  {formattedResponses.map((item, index) => (
                    <div key={index} className="bg-blue-50 rounded-xl p-4 space-y-2 border border-blue-100">
                      <div className="font-medium text-blue-800 flex items-start gap-2">
                        <Eye className="h-4 w-4 mt-1 flex-shrink-0" />
                        <span>{item.question}</span>
                      </div>
                      <div className="text-gray-700 bg-white p-3 rounded-lg border border-blue-100 ml-6">
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                  <p className="text-gray-500">Nenhuma resposta encontrada para esta demanda.</p>
                  {(demand.status === 'pendente' || demand.status === 'em_andamento') && (
                    <Button 
                      onClick={handleRespondToDemand} 
                      variant="outline" 
                      className="mt-4 flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Responder Agora
                    </Button>
                  )}
                </div>
              )}

              {responseData?.comentarios && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-gray-700">Comentários Internos:</h4>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                    <p className="whitespace-pre-wrap text-gray-700">{responseData.comentarios}</p>
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
                  <Badge className="bg-blue-100 text-blue-800 border border-blue-200 rounded-full px-3 py-1">{nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}</Badge>
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
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" /> Visualizar
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleEditNota}
                    className="flex items-center gap-2"
                  >
                    <LucideEdit className="h-4 w-4" /> Editar
                  </Button>
                  
                  {nota.status === 'pendente' && (
                    <>
                      <Button 
                        variant="destructive" 
                        onClick={() => updateNotaStatus('rejeitada')}
                        disabled={isUpdatingNota}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" /> Recusar
                      </Button>
                      
                      <Button 
                        variant="default" 
                        onClick={() => updateNotaStatus('aprovada')}
                        disabled={isUpdatingNota}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" /> Aprovar
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
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
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
