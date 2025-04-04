
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import BackButton from '@/components/layouts/BackButton';
import ReleaseForm from '@/components/release/ReleaseForm';
import NewsEditForm from '@/components/release/NewsEditForm';
import GenerateNewsDialog from '@/components/release/GenerateNewsDialog';
import { useReleaseForm } from '@/hooks/release/useReleaseForm';

const CadastrarRelease = () => {
  const location = useLocation();
  const {
    releaseContent,
    setReleaseContent,
    isGeneratingNews,
    isSavingRelease,
    generatedNews,
    setGeneratedNews,
    isEditingNews,
    setIsEditingNews,
    showGenerateDialog,
    setShowGenerateDialog,
    isLoading,
    fetchReleaseContent,
    fetchNoticiaContent,
    handleSaveRelease,
    handleGenerateNews,
    handleSaveNews,
  } = useReleaseForm();

  // Parse query parameters to check if we're editing a release or noticia
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const releaseId = params.get('releaseId');
    const noticiaId = params.get('noticiaId');
    
    if (releaseId) {
      // Fetch the release content to generate news
      fetchReleaseContent(releaseId);
    } else if (noticiaId) {
      // Load the noticia for editing
      fetchNoticiaContent(noticiaId);
    }
  }, [location.search]);

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton destination="/dashboard/comunicacao/releases" />
      
      <WelcomeCard
        title="Cadastrar Release"
        description="Transforme releases recebidos por e-mail em notícias editáveis"
        icon={<Sparkles className="h-6 w-6 text-white" />}
        color="bg-gradient-to-r from-indigo-500 to-indigo-600"
      />

      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
        {!isEditingNews ? (
          <ReleaseForm
            releaseContent={releaseContent}
            setReleaseContent={setReleaseContent}
            handleSaveRelease={handleSaveRelease}
            handleGenerateNews={() => handleGenerateNews()}
            isSavingRelease={isSavingRelease}
            isGeneratingNews={isGeneratingNews}
            isLoading={isLoading}
          />
        ) : (
          <NewsEditForm
            generatedNews={generatedNews}
            setGeneratedNews={setGeneratedNews}
            setIsEditingNews={setIsEditingNews}
            handleSaveNews={handleSaveNews}
            isSavingRelease={isSavingRelease}
          />
        )}
      </div>

      {/* Dialog to ask if user wants to generate news after saving release */}
      <GenerateNewsDialog
        open={showGenerateDialog}
        setOpen={setShowGenerateDialog}
        onCancel={() => {
          setShowGenerateDialog(false);
          // Redirect to releases tab
          window.location.href = '/dashboard/comunicacao/releases?tab=releases';
        }}
        onGenerateNews={() => {
          setShowGenerateDialog(false);
          handleGenerateNews();
        }}
      />
    </motion.div>
  );
};

export default CadastrarRelease;
