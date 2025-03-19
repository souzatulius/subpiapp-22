
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { User, Area, Cargo, Announcement } from './types';

export const useAnnouncementsData = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchAnnouncements();
    fetchUsers();
    fetchAreas();
    fetchCargos();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comunicados')
        .select(`
          *,
          autor:autor_id(id, nome_completo, email)
        `)
        .order('data_envio', { ascending: false });
      
      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar comunicados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os comunicados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome_completo, email');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('id, descricao');
      
      if (error) throw error;
      setAreas(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar áreas:', error);
    }
  };

  const fetchCargos = async () => {
    try {
      const { data, error } = await supabase
        .from('cargos')
        .select('id, descricao');
      
      if (error) throw error;
      setCargos(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar cargos:', error);
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const searchTerms = filter.toLowerCase();
    return (
      announcement.titulo?.toLowerCase().includes(searchTerms) ||
      announcement.mensagem?.toLowerCase().includes(searchTerms) ||
      announcement.destinatarios?.toLowerCase().includes(searchTerms) ||
      announcement.autor?.nome_completo?.toLowerCase().includes(searchTerms)
    );
  });

  return {
    announcements,
    users,
    areas,
    cargos,
    loading,
    filter,
    setFilter,
    fetchAnnouncements,
    filteredAnnouncements
  };
};
