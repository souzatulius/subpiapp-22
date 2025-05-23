
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface Note {
  id: string;
  titulo: string;
  status: string;
  criado_em: string;
  autor?: {
    nome_completo?: string;
  } | null;
  coordenacao?: {
    sigla?: string;
    descricao?: string;
  } | null;
}

interface NotesApprovalCardProps {
  maxNotes?: number;
}

const NotesApprovalCard: React.FC<NotesApprovalCardProps> = ({
  maxNotes = 5
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const {
          data,
          error
        } = await supabase.from('notas_oficiais').select(`
            id, 
            titulo, 
            status, 
            criado_em,
            autor:usuarios!autor_id(nome_completo),
            problema:problema_id (
              coordenacao:coordenacao_id (sigla, descricao)
            )
          `).order('criado_em', {
          ascending: false
        }).limit(maxNotes);
        
        if (error) throw error;
        
        const processedNotes: Note[] = (data || []).map(note => {
          return {
            id: note.id,
            titulo: note.titulo,
            status: note.status,
            criado_em: note.criado_em,
            autor: note.autor,
            coordenacao: note.problema?.coordenacao || null
          };
        });
        
        setNotes(processedNotes);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotes();
    const interval = setInterval(fetchNotes, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [maxNotes]);

  const handleNoteClick = (noteId: string) => {
    navigate(`/dashboard/comunicacao/notas/detalhe?id=${noteId}`);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'aprovada':
        return 'bg-green-500 hover:bg-green-600';
      case 'rejeitada':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'Pendente';
      case 'aprovada':
        return 'Aprovada';
      case 'rejeitada':
        return 'Rejeitada';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex flex-col h-full border border-slate-300 bg-orange-500 px-0 py-0 rounded-2xl">
        <h3 className="text-lg font-semibold mb-2 text-center py-[6px] my-[12px] text-zinc-50">Últimas Notas</h3>
        <div className="overflow-auto flex-1">
          {notes.length === 0 ? (
            <div className="text-sm bg-gray-300 my-0 px-[8px] mx-[5px] py-[5px] rounded-xl">
              Nenhuma nota disponível
            </div>
          ) : (
            <ul className="space-y-2 px-1">
              {notes.map(note => (
                <li 
                  key={note.id} 
                  onClick={() => handleNoteClick(note.id)} 
                  className="p-2 cursor-pointer transition-all bg-gray-100 hover:bg-gray-200 rounded-2xl mx-[6px] px-[13px]"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800 w-full line-clamp-2 h-[40px]">
                      {note.titulo}
                    </span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-600">
                        {note.coordenacao?.sigla || note.coordenacao?.descricao || 'Coordenação'}
                      </span>
                      <Badge className="rounded-2xl text-xs bg-gray-300 text-gray-600 px-[10px] py-[4px]">
                        {getStatusLabel(note.status)}
                      </Badge>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotesApprovalCard;
