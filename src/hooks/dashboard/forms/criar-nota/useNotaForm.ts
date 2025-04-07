import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand, ResponseQA } from '@/types/demand';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { normalizeQuestions } from '@/utils/questionFormatUtils';

export const useNotaForm = (onClose: () => void) => {
  const [selectedDemanda, setSelectedDemanda] = useState<Demand | null>(null);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'select-demand' | 'create-nota'>('select-demand');
  const [formattedResponses, setFormattedResponses] = useState<ResponseQA[]>([]);
  const [demandaRespostas, setDemandaRespostas] = useState<any>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for demandaId in query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const demandaId = searchParams.get('demandaId');
    
    if (demandaId) {
      fetchDemanda(demandaId);
    }
  }, [location]);
  
  const fetchDemanda = async (demandaId: string) => {
    try {
      const { data: demandaData, error: demandaError } = await supabase
        .from('demandas')
        .select(`
          *,
          problema:problema_id (
            id, 
            descricao,
            coordenacao_id,
            coordenacao:coordenacao_id (id, descricao)
          ),
          origem:origem_id (id, descricao),
          tipo_midia:tipo_midia_id (id, descricao),
          bairro:bairro_id (id, nome)
        `)
        .eq('id', demandaId)
        .single();
      
      if (demandaError) throw demandaError;
      
      // Fetch resposta for this demanda
      const { data: respostaData, error: respostaError } = await supabase
        .from('respostas_demandas')
        .select('*')
        .eq('demanda_id', demandaId)
        .maybeSingle();
      
      if (respostaError) throw respostaError;
      
      if (!respostaData) {
        toast({
          title: "Demanda sem resposta",
          description: "Esta demanda ainda não possui uma resposta. Responda à demanda antes de criar uma nota.",
          variant: "destructive"
        });
        
        setStep('select-demand');
        return;
      }
      
      // Set demanda resposta state
      setDemandaRespostas(respostaData);
      
      // Process the question and response pairs
      if (demandaData.perguntas && respostaData?.respostas) {
        const questions = normalizeQuestions(demandaData.perguntas);
        const responses = typeof respostaData.respostas === 'string' 
          ? JSON.parse(respostaData.respostas) 
          : respostaData.respostas;
        
        const formattedQA = questions.map((q, index) => ({
          question: q,
          answer: responses[index.toString()] || ''
        }));
        
        setFormattedResponses(formattedQA);
      }
      
      // Prepare demanda data
      const demanda: Demand = {
        id: demandaData.id,
        titulo: demandaData.titulo,
        status: demandaData.status,
        prioridade: demandaData.prioridade,
        horario_publicacao: demandaData.horario_publicacao,
        prazo_resposta: demandaData.prazo_resposta,
        area_coordenacao: {
          id: demandaData.problema?.coordenacao?.id || '',
          descricao: demandaData.problema?.coordenacao?.descricao || 'Não informada'
        },
        problema: demandaData.problema,
        problema_id: demandaData.problema_id,
        supervisao_tecnica: {
          id: '',
          descricao: ''
        },
        origem: demandaData.origem,
        tipo_midia: demandaData.tipo_midia,
        bairro: demandaData.bairro,
        autor: { nome_completo: '' },
        endereco: demandaData.endereco,
        nome_solicitante: demandaData.nome_solicitante,
        email_solicitante: demandaData.email_solicitante,
        telefone_solicitante: demandaData.telefone_solicitante,
        veiculo_imprensa: demandaData.veiculo_imprensa,
        detalhes_solicitacao: demandaData.detalhes_solicitacao,
        perguntas: demandaData.perguntas,
        servico: { id: '', descricao: '' },
        arquivo_url: demandaData.arquivo_url,
        anexos: demandaData.anexos,
        resposta: respostaData ? {
          id: respostaData.id,
          demanda_id: respostaData.demanda_id,
          texto: respostaData.texto,
          comentarios: respostaData.comentarios
        } : null
      };
      
      setSelectedDemanda(demanda);
      setStep('create-nota');
      
      // Default title based on demanda
      if (demanda.titulo) {
        setTitulo(`Nota Oficial: ${demanda.titulo}`);
      }
    } catch (error) {
      console.error('Error fetching demanda:', error);
      toast({
        title: "Erro ao carregar demanda",
        description: "Não foi possível carregar os detalhes da demanda.",
        variant: "destructive"
      });
    }
  };
  
  const handleDemandaSelect = async (demandaId: string, demandas: Demand[]) => {
    // Find the demanda in the list
    const demanda = demandas.find(d => d.id === demandaId);
    
    if (!demanda) {
      toast({
        title: "Demanda não encontrada",
        description: "A demanda selecionada não foi encontrada.",
        variant: "destructive"
      });
      return;
    }
    
    // Fetch resposta for this demanda
    try {
      const { data: respostaData, error: respostaError } = await supabase
        .from('respostas_demandas')
        .select('*')
        .eq('demanda_id', demandaId)
        .maybeSingle();
      
      if (respostaError) throw respostaError;
      
      if (!respostaData) {
        toast({
          title: "Demanda sem resposta",
          description: "Esta demanda ainda não possui uma resposta. Responda à demanda antes de criar uma nota.",
          variant: "destructive"
        });
        return;
      }
      
      // Set demanda resposta state
      setDemandaRespostas(respostaData);
      
      // Process the question and response pairs
      if (demanda.perguntas && respostaData?.respostas) {
        const questions = normalizeQuestions(demanda.perguntas);
        const responses = typeof respostaData.respostas === 'string' 
          ? JSON.parse(respostaData.respostas) 
          : respostaData.respostas;
        
        const formattedQA = questions.map((q, index) => ({
          question: q,
          answer: responses[index.toString()] || ''
        }));
        
        setFormattedResponses(formattedQA);
      }
      
      // Set selected demanda and move to next step
      setSelectedDemanda({
        ...demanda,
        resposta: respostaData ? {
          id: respostaData.id,
          demanda_id: respostaData.demanda_id,
          texto: respostaData.texto,
          comentarios: respostaData.comentarios
        } : null
      });
      
      setStep('create-nota');
      
      // Default title based on demanda
      if (demanda.titulo) {
        setTitulo(`Nota Oficial: ${demanda.titulo}`);
      }
    } catch (error) {
      console.error('Error fetching demanda resposta:', error);
      toast({
        title: "Erro ao carregar resposta",
        description: "Não foi possível carregar as respostas desta demanda.",
        variant: "destructive"
      });
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedDemanda) {
      toast({
        title: "Demanda não selecionada",
        description: "Selecione uma demanda para criar a nota.",
        variant: "destructive"
      });
      return;
    }
    
    if (!texto.trim()) {
      toast({
        title: "Texto vazio",
        description: "O texto da nota não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }
    
    if (!titulo.trim()) {
      toast({
        title: "Título vazio",
        description: "O título da nota não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get coordination ID from problema or area_coordenacao
      const coordinationId = selectedDemanda.problema?.coordenacao?.id || 
                             selectedDemanda.area_coordenacao?.id || null;
      
      const { data, error } = await supabase
        .from('notas_oficiais')
        .insert({
          titulo: titulo,
          texto: texto,
          problema_id: selectedDemanda.problema_id,
          autor_id: user?.id,
          demanda_id: selectedDemanda.id,
          coordenacao_id: coordinationId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Nota criada com sucesso",
        description: "A nota oficial foi criada e está aguardando aprovação.",
      });
      
      // If an onClose function is provided, call it (for modal contexts)
      if (typeof onClose === 'function') {
        onClose();
      } else {
        // Otherwise, navigate back to the notas page
        navigate('/dashboard/comunicacao/notas');
      }
    } catch (error) {
      console.error('Erro ao criar nota:', error);
      toast({
        title: "Erro ao criar nota",
        description: "Não foi possível criar a nota oficial.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    selectedDemanda,
    titulo,
    setTitulo,
    texto,
    setTexto,
    isSubmitting,
    step,
    formattedResponses,
    demandaRespostas,
    handleDemandaSelect,
    handleSubmit
  };
};
