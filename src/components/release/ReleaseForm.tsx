
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Sparkles } from 'lucide-react';

interface ReleaseFormProps {
  releaseContent: string;
  setReleaseContent: (content: string) => void;
  handleSaveRelease: () => void;
  handleGenerateNews: () => void;
  isSavingRelease: boolean;
  isGeneratingNews: boolean;
  isLoading: boolean;
}

const ReleaseForm: React.FC<ReleaseFormProps> = ({
  releaseContent,
  setReleaseContent,
  handleSaveRelease,
  handleGenerateNews,
  isSavingRelease,
  isGeneratingNews,
  isLoading
}) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Novo Release</h2>
      <Textarea
        className="min-h-[300px] mb-4"
        placeholder="Cole aqui o release recebido por e-mail"
        value={releaseContent}
        onChange={(e) => setReleaseContent(e.target.value)}
        disabled={isLoading}
      />
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={handleSaveRelease}
          disabled={isSavingRelease || isGeneratingNews || isLoading}
        >
          {isSavingRelease ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar Release
        </Button>
        <Button 
          onClick={handleGenerateNews}
          disabled={isGeneratingNews || isSavingRelease || isLoading}
        >
          {isGeneratingNews ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Gerar Notícia
        </Button>
      </div>
    </>
  );
};

export default ReleaseForm;
