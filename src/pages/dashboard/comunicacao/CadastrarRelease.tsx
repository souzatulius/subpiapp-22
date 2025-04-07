
import React from 'react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { FileText } from 'lucide-react';
import ReleaseForm from '@/components/comunicacao/release/ReleaseForm';
import ConfirmDialog from '@/components/comunicacao/release/ConfirmDialog';
import GeneratedContentDialog from '@/components/comunicacao/release/GeneratedContentDialog';
import { useReleaseForm } from '@/hooks/comunicacao/useReleaseForm';

const CadastrarRelease = () => {
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

  return (
    <div className="space-y-6">
      <WelcomeCard
        title="Nova Notícia"
        description="Crie e publique novas notícias e releases para divulgação na imprensa"
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
