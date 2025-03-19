import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { ArrowLeft, User, Calendar, Clock, Loader2, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DetalhesDemandaProps {
  demandaId: string;
  onClose: () => void;
}

interface AreaCoordenacao {
  id: string;
  descricao: string;
}

interface Autor {
  nome_completo: string;
}

interface Usuario {
  nome_completo: string;
}

interface Resposta {
  id: string;
  texto: string;
  arquivo_url?: string;
  criado_em: string;
  usuario?: Usuario;
}

interface Demanda {
  id: string;
  titulo: string;
  status: string;
  horario_publicacao: string;
  prazo_resposta: string;
  detalhes_solicitacao?: string;
  perguntas?: Record<string, string>;
  arquivo_url?: string;
  area_coordenacao?: AreaCoordenacao;
  autor?: Autor;
}

const DetalhesDemanda: React.FC<DetalhesDemandaProps> = ({ demandaId, onClose }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  
  const { data: demanda, isLoading: demandaLoading } = useQuery({
    queryKey: ['demanda-detalhes', demandaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demandas')
        .select(`
          id,
          titulo,
          status,
          horario_publicacao,
          prazo_resposta,
          detalhes_solicitacao,
          perguntas,
          arquivo_url,
          area_coordenacao:area_coordenacao_id (id, descricao),
          autor:autor_id (nome_completo)
        `)
        .eq('id', demandaId)
        .single();
      
      if (error) throw error;
      return data as Demanda;
    }
  });
  
  const { data: respostas, isLoading: respostasLoading } = useQuery({
    queryKey: ['respostas-demanda', demandaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('respostas_demandas')
        .select(`
          id,
          texto,
          arquivo_url,
          criado_em,
          usuario:usuario_id (nome_completo)
        `)
        .eq('demanda_id', demandaId);
      
      if (error) throw error;
      return (data || []) as Resposta[];
    }
  });
  
  const { data: notaExistente } = useQuery({
    queryKey: ['nota-oficial-existente', demandaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notas_oficiais')
        .select('*')
        .eq('demanda_id', demandaId);
      
      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    }
  });
  
  const criarNotaMutation = useMutation({
    mutationFn: async () => {
      if (!demanda?.area_coordenacao?.id || !user?.id) {
        throw new Error('Dados insuficientes para criar a nota oficial');
      }
      
      const { data, error } = await supabase
        .from('notas_oficiais')
        .insert([{
          titulo,
          texto,
          autor_id: user.id,
          area_coordenacao_id: demanda.area_coordenacao.id,
          demanda_id: demandaId,
          status: 'pendente'
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Nota oficial criada',
        description: 'A nota oficial foi criada com sucesso e está aguardando aprovação.',
      });
      queryClient.invalidateQueries({ queryKey: ['nota-oficial-existente', demandaId] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar nota',
        description: `Ocorreu um erro: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  const handleSubmit = () => {
    if (!titulo.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Por favor, informe um título para a nota oficial.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!texto.trim()) {
      toast({
        title: 'Conteúdo obrigatório',
        description: 'Por favor, informe o conteúdo da nota oficial.',
        variant: 'destructive',
      });
      return;
    }
    
    criarNotaMutation.mutate();
  };
  
  const isLoading = demandaLoading || respostasLoading;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  if (!demanda) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">Demanda não encontrada</h3>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }
  
  const formatarPerguntasRespostas = () => {
    if (!demanda?.perguntas) return [];
    
    return Object.entries(demanda.perguntas as Record<string, string>).map(([key, pergunta]) => {
      const respostaTexto = respostas && respostas.length > 0 ? respostas[0].texto : '';
      
      const perguntaIndex = respostaTexto.indexOf(`Pergunta: ${pergunta}`);
      let resposta = '';
      
      if (perguntaIndex >= 0) {
        const respostaIndex = respostaTexto.indexOf('Resposta:', perguntaIndex);
        if (respostaIndex >= 0) {
          const nextPerguntaIndex = respostaTexto.indexOf('Pergunta:', respostaIndex);
          resposta = respostaTexto.substring(
            respostaIndex + 'Resposta:'.length,
            nextPerguntaIndex > 0 ? nextPerguntaIndex : undefined
          ).trim();
        }
      }
      
      return {
        pergunta,
        resposta
      };
    });
  };
  
  const perguntasRespostas = formatarPerguntasRespostas();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4 p-2" 
          onClick={onClose}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{demanda.titulo}</h2>
          <p className="text-sm text-gray-500">
            {demanda.area_coordenacao?.descricao}
          </p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Autor</p>
                <p>{demanda.autor?.nome_completo}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Data de Criação</p>
                <p>{format(new Date(demanda.horario_publicacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Prazo</p>
                <p>{format(new Date(demanda.prazo_resposta), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
            </div>
            
            {demanda.arquivo_url && (
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Arquivo</p>
                  <a 
                    href={demanda.arquivo_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Visualizar arquivo
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {demanda.detalhes_solicitacao && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Detalhes da Solicitação</h3>
              <p className="whitespace-pre-line text-gray-700">{demanda.detalhes_solicitacao}</p>
            </div>
          )}
          
          <Separator className="my-6" />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Perguntas e Respostas</h3>
            
            {perguntasRespostas.length > 0 ? (
              <div className="space-y-4">
                {perguntasRespostas.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">{item.pergunta}</h4>
                    <Separator className="my-2" />
                    <p className="text-gray-700">{item.resposta}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Não há perguntas cadastradas para esta demanda.</p>
            )}
          </div>
          
          {respostas && respostas.length > 0 && respostas[0].usuario && (
            <div className="mt-4 text-sm text-gray-500 flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>Respondido por: {respostas[0].usuario.nome_completo}</span>
              <span className="mx-2">•</span>
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {format(new Date(respostas[0].criado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Criar Nota Oficial</h3>
          
          {notaExistente ? (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-700">
                Já existe uma nota oficial criada para esta demanda com o status "{notaExistente.status}".
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                  Título da Nota
                </label>
                <Input
                  id="titulo"
                  placeholder="Insira um título para a nota oficial"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="texto" className="block text-sm font-medium text-gray-700 mb-1">
                  Texto da Nota
                </label>
                <Textarea
                  id="texto"
                  placeholder="Escreva o conteúdo da nota oficial"
                  rows={8}
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={criarNotaMutation.isPending}
                  className="bg-[#003570] hover:bg-[#002855]"
                >
                  {criarNotaMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Salvar Nota Oficial
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalhesDemanda;
