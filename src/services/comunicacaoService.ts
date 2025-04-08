
import { supabase } from '@/integrations/supabase/client';

export interface ReleaseData {
  titulo: string;
  texto: string;
  tags?: string[];
}

export const cadastrarRelease = async (data: ReleaseData) => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const userId = userData.user.id;
    
    // Insert into releases table
    const { data: insertData, error: insertError } = await supabase
      .from('releases')
      .insert({
        titulo: data.titulo,
        conteudo: data.texto,
        tags: data.tags || [],
        autor_id: userId,
        tipo: 'release',
        status: 'pendente'
      });
    
    if (insertError) throw insertError;
    
    return { success: true, data: insertData };
  } catch (error) {
    console.error('Error creating release:', error);
    throw error;
  }
};

export const getRelease = async (releaseId: string) => {
  try {
    const { data, error } = await supabase
      .from('releases')
      .select('*')
      .eq('id', releaseId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching release:', error);
    throw error;
  }
};

export const getAllReleases = async () => {
  try {
    const { data, error } = await supabase
      .from('releases')
      .select('*')
      .eq('tipo', 'release')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching releases:', error);
    throw error;
  }
};

export const getNotesByStatus = async (status: string) => {
  try {
    const { data, error } = await supabase
      .from('notas_oficiais')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};
