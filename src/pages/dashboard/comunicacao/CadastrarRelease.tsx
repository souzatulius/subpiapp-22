
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { FileText } from 'lucide-react';
import ReleaseForm from '@/components/comunicacao/release/ReleaseForm';
import ConfirmDialog from '@/components/comunicacao/release/ConfirmDialog';
import GeneratedContentDialog from '@/components/comunicacao/release/GeneratedContentDialog';
import { useReleaseForm } from '@/hooks/comunicacao/useReleaseForm';
import { supabase } from '@/integrations/supabase/client';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

const CadastrarRelease = () => {
  const [searchParams] = useSearchParams();
  const releaseId = searchParams.get('releaseId');
  const { showFeedback } = useAnimatedFeedback();
  
  const {
    releaseContent,
    setReleaseContent,
    isSubmitting,
    isGenerating,
    showConfirmDialog,
    setShowConfirmDialog,
    showGeneratedContent,
    setShowGeneratedContent,
    generatedContent,
    editedTitle,
    setEditedTitle,
    editedContent,
    setEditedContent,
    handleSaveRelease,
    handleGenerateNews,
    handleCreateNote,
    handleCancelGeneration
  } = useReleaseForm();

  // Load release content when releaseId is provided
  useEffect(() => {
    const fetchReleaseContent = async () => {
      if (!releaseId) return;
      
      try {
        const { data, error } = await supabase
          .from('releases')
          .select('*')
          .eq('id', releaseId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Set the release content from the fetched data
          setReleaseContent(data.conteudo || '');
          
          // If the release is already loaded, we can proceed to generate news automatically
          handleGenerateNews();
        }
      } catch (error: any) {
        console.error('Error fetching release:', error);
        showFeedback('error', 'Não foi possível carregar o conteúdo do release');
      }
    };
    
    fetchReleaseContent();
  }, [releaseId]);

  return (
    <div className="space-y-6">
      <WelcomeCard
        title="Cadastrar Release"
        description="Crie e publique releases para divulgação na imprensa"
        icon={<FileText className="h-6 w-6 mr-2 text-white" />}
        color="bg-gradient-to-r from-blue-500 to-blue-700"
      />

      <ReleaseForm
        releaseContent={releaseContent}
        onReleaseContentChange={setReleaseContent}
        onSave={handleSaveRelease}
        onGenerate={handleGenerateNews}
        isSubmitting={isSubmitting}
        isGenerating={isGenerating}
      />
      
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleGenerateNews}
        onCancel={handleCancelGeneration}
      />
      
      <GeneratedContentDialog
        open={showGeneratedContent}
        onOpenChange={setShowGeneratedContent}
        generatedContent={generatedContent}
        editedTitle={editedTitle}
        editedContent={editedContent}
        onEditedTitleChange={setEditedTitle}
        onEditedContentChange={setEditedContent}
        onCreateNote={handleCreateNote}
        isLoading={isGenerating}
      />
    </div>
  );
};

export default CadastrarRelease;
