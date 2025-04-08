
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ReleaseData {
  titulo: string;
  texto: string;
  tags?: string[];
}

/**
 * Cadastra um novo release no sistema
 * @param releaseData Dados do release
 * @returns O objeto do release cadastrado
 */
export const cadastrarRelease = async (releaseData: ReleaseData) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    // Process tags
    const tagsString = Array.isArray(releaseData.tags) ? 
      releaseData.tags.join(',') : 
      '';
    
    // Insert the release
    const { data, error } = await supabase
      .from('releases')
      .insert({
        titulo: releaseData.titulo,
        conteudo: releaseData.texto,
        tags: tagsString,
        autor_id: user.id,
        tipo: 'release',
        status: 'rascunho'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error in cadastrarRelease:', error);
    throw new Error(error.message || 'Falha ao cadastrar release');
  }
}
