import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, User, CalendarClock, Edit, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface HistoryItem {
  id: string;
  timestamp: string;
  evento: string;
  usuario: {
    nome_completo: string;
  } | null;
  detalhes: any;
}

interface NotaEditHistoryItem {
  id: string;
  editor_nome: string;
  criado_em: string;
  titulo_anterior: string;
  titulo_novo: string;
  texto_alterado: boolean;
}

interface DemandHistorySectionProps {
  demandaId: string;
  notaId: string;
  notaCreatedAt: string;
}

const DemandHistorySection: React.FC<DemandHistorySectionProps> = ({ 
  demandaId, 
  notaId,
  notaCreatedAt 
}) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [notaEditHistory, setNotaEditHistory] = useState<NotaEditHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!demandaId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Fetch demand history
        const { data: historyData, error } = await supabase
          .from('historico_demandas')
          .select(`
            id,
            timestamp,
            evento,
            usuario_id,
            detalhes
          `)
          .eq('demanda_id', demandaId)
          .order('timestamp', { ascending: false });
          
        if (error) {
          console.error('Erro ao carregar histórico da demanda:', error);
          throw error;
        }
        
        // Get the user information separately for each history item
        const enhancedHistoryItems: HistoryItem[] = await Promise.all((historyData || []).map(async (item) => {
          let userData = null;
          if (item.usuario_id) {
            const { data: user } = await supabase
              .from('usuarios')
              .select('nome_completo')
              .eq('id', item.usuario_id)
              .maybeSingle();
            userData = user;
          }
          
          return {
            id: item.id,
            timestamp: item.timestamp,
            evento: item.evento,
            usuario: userData || { nome_completo: 'Sistema' },
            detalhes: item.detalhes
          };
        }));
        
        setHistoryItems(enhancedHistoryItems);
        
        // Fetch nota edit history if nota ID is provided
        if (notaId) {
          const { data: notaHistory, error: notaError } = await supabase
            .from('notas_historico_edicoes')
            .select('id, criado_em, editor_id, titulo_anterior, titulo_novo, texto_anterior, texto_novo');
            
          if (notaError) {
            console.error('Erro ao carregar histórico de edições da nota:', notaError);
          } else if (notaHistory && notaHistory.length > 0) {
            // For each edit history entry, get the editor name
            const notaEditsWithEditors = await Promise.all(
              notaHistory.map(async (edit) => {
                let editorName = 'Editor desconhecido';
                if (edit.editor_id) {
                  const { data: editor } = await supabase
                    .from('usuarios')
                    .select('nome_completo')
                    .eq('id', edit.editor_id)
                    .maybeSingle();
                  
                  if (editor) {
                    editorName = editor.nome_completo;
                  }
                }
                
                return {
                  id: edit.id,
                  editor_nome: editorName,
                  criado_em: edit.criado_em,
                  titulo_anterior: edit.titulo_anterior || '',
                  titulo_novo: edit.titulo_novo || '',
                  texto_alterado: edit.texto_anterior !== edit.texto_novo
                };
              })
            );
            
            setNotaEditHistory(notaEditsWithEditors);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [demandaId, notaId]);

  const formatEvent = (evento: string): string => {
    const eventMap: Record<string, string> = {
      'criada': 'Demanda criada',
      'pendente': 'Demanda pendente',
      'em_andamento': 'Demanda respondida',
      'aguardando_nota': 'Aguardando nota',
      'aguardando_aprovacao': 'Aguardando aprovação',
      'concluida': 'Concluída',
      'concluida_editada': 'Concluída (editada)',
      'concluida_recusada': 'Concluída (recusada)',
      'cancelada': 'Cancelada',
      'arquivada': 'Arquivada',
      'nota_criada': 'Nota criada',
      'nota_aprovada': 'Nota aprovada',
      'nota_rejeitada': 'Nota rejeitada',
      'nota_excluida': 'Nota excluída',
      'nota_editada': 'Nota editada'
    };
    
    return eventMap[evento] || evento;
  };

  const formatTimestamp = (timestamp: string): string => {
    try {
      return format(new Date(timestamp), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };
  
  const isRelatedToCurrentNote = (item: HistoryItem): boolean => {
    return item.detalhes && item.detalhes.nota_id === notaId;
  };

  const getEventColor = (evento: string, isRelated: boolean): string => {
    if (isRelated) {
      return 'bg-blue-100 border-blue-300';
    }
    
    if (evento.includes('nota_')) {
      return 'bg-gray-100 border-gray-200';
    }
    
    if (evento === 'criada') {
      return 'bg-green-50 border-green-200';
    }
    
    if (evento.includes('concluida')) {
      return 'bg-purple-50 border-purple-200';
    }
    
    return 'bg-gray-50 border-gray-200';
  };

  const displayedItems = expanded ? historyItems : historyItems.slice(0, 3);
  const displayedNotaEdits = expanded ? notaEditHistory : notaEditHistory.slice(0, 2);
  const totalItems = historyItems.length + notaEditHistory.length;
  const displayedTotal = displayedItems.length + displayedNotaEdits.length;

  if (loading) {
    return (
      <Card className="p-4 bg-gray-50 border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </Card>
    );
  }

  if (historyItems.length === 0 && notaEditHistory.length === 0) {
    return (
      <Card className="p-4 bg-gray-50 border border-gray-200">
        <p className="text-sm text-gray-500">Sem histórico disponível para esta demanda.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gray-50 border border-gray-200">
      <div className="mb-3 flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">Histórico da Demanda</h4>
        <Link 
          to={`/dashboard/comunicacao/consultar-demandas?demanda=${demandaId}`}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <span>Ver demanda</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
      
      <div className="space-y-2 relative">
        <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Display nota edit history */}
        {notaEditHistory.length > 0 && displayedNotaEdits.map((edit) => (
          <div 
            key={edit.id} 
            className="pl-6 py-2 pr-3 relative rounded-md border bg-blue-50 border-blue-200"
          >
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2.5 w-5 h-5 rounded-full bg-white border-2 border-blue-300 flex items-center justify-center">
              <Edit className="h-2.5 w-2.5 text-blue-600" />
            </div>
            
            <div className="text-xs">
              <p className="font-medium">Nota editada</p>
              <div className="flex justify-between items-center mt-1 text-gray-600">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{edit.editor_nome}</span>
                </span>
                <span>{formatTimestamp(edit.criado_em)}</span>
              </div>
              
              <div className="mt-1.5 text-blue-800 text-xs">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span className="line-through text-blue-400">{edit.titulo_anterior}</span>
                  <span className="mx-1">→</span>
                  <span className="font-medium">{edit.titulo_novo}</span>
                </div>
                {edit.texto_alterado && (
                  <p className="mt-0.5 text-xs italic">Conteúdo do texto também foi alterado</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Display demand history items */}
        {displayedItems.map((item) => {
          const isRelated = isRelatedToCurrentNote(item);
          return (
            <div 
              key={item.id} 
              className={`pl-6 py-2 pr-3 relative rounded-md border ${getEventColor(item.evento, isRelated)}`}
            >
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2.5 w-5 h-5 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                {item.evento.includes('nota_') ? (
                  <Clock className="h-2.5 w-2.5 text-gray-600" />
                ) : (
                  <CalendarClock className="h-2.5 w-2.5 text-gray-600" />
                )}
              </div>
              
              <div className="text-xs">
                <p className="font-medium">{formatEvent(item.evento)}</p>
                <div className="flex justify-between items-center mt-1 text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{item.usuario?.nome_completo || 'Sistema'}</span>
                  </span>
                  <span>{formatTimestamp(item.timestamp)}</span>
                </div>
                
                {isRelated && (
                  <div className="mt-1 text-blue-700 text-xs">
                    Nota atual: {item.detalhes?.titulo || 'Sem título'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalItems > displayedTotal && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-2 text-gray-600 text-xs"
        >
          {expanded ? 'Mostrar menos' : `Ver mais (${totalItems - displayedTotal} itens)`}
        </Button>
      )}
    </Card>
  );
};

export default DemandHistorySection;
