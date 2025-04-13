
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

const NotesApprovalCard: React.FC<NotesApprovalCardProps> = ({ maxNotes = 5 }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select(`
            id, 
            titulo, 
            status, 
            criado_em,
            autor:autor_id (nome_completo),
            coordenacao:coordenacao_id (sigla, descricao)
          `)
          .order('criado_em', { ascending: false })
          .limit(maxNotes);
        
        if (error) throw error;
        
        // Handle possible null values and type mismatches
        const processedNotes: Note[] = (data || []).map(note => ({
          id: note.id,
          titulo: note.titulo,
          status: note.status,
          criado_em: note.criado_em,
          autor: note.autor,
          coordenacao: note.coordenacao
        }));
        
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
      case 'pendente': return 'bg-orange-500 hover:bg-orange-600';
      case 'aprovada': return 'bg-green-500 hover:bg-green-600';
      case 'rejeitada': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pendente': return 'Pendente';
      case 'aprovada': return 'Aprovada';
      case 'rejeitada': return 'Rejeitada';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
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
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-2 text-center">Últimas Notas</h3>
        <div className="overflow-auto flex-1">
          {notes.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              Nenhuma nota disponível
            </div>
          ) : (
            <ul className="space-y-2 px-1">
              {notes.map((note) => (
                <li 
                  key={note.id}
                  onClick={() => handleNoteClick(note.id)}
                  className="p-2 rounded-lg cursor-pointer transition-all bg-gray-100 hover:bg-gray-200"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate text-gray-800 w-full">
                      {note.titulo}
                    </span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-600">
                        {note.coordenacao?.sigla || note.coordenacao?.descricao || 'Coordenação'}
                      </span>
                      <Badge className={`ml-1 shrink-0 text-xs ${getStatusColor(note.status)}`}>
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
};

export default NotesApprovalCard;
