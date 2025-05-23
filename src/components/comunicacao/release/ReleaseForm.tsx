
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Wand2 } from 'lucide-react';

interface ReleaseFormProps {
  releaseContent: string;
  onReleaseContentChange: (content: string) => void;
  onSave: () => void;
  onGenerate: () => void;
  isSubmitting: boolean;
  isGenerating: boolean;
}

const ReleaseForm: React.FC<ReleaseFormProps> = ({
  releaseContent,
  onReleaseContentChange,
  onSave,
  onGenerate,
  isSubmitting,
  isGenerating
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4 px-6 pt-6">Cadastrar Release</h2>
      
      <div className="mb-6 px-6">
        <Textarea 
          value={releaseContent}
          onChange={(e) => onReleaseContentChange(e.target.value)}
          placeholder="Cole aqui o texto do release recebido por e-mail"
          className="min-h-[400px] w-full rounded-xl"
        />
      </div>
      
      <div className="flex flex-wrap gap-3 justify-end px-6 pb-6">
        <Button 
          variant="default" 
          onClick={onSave}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-[#003570] hover:bg-[#002855]"
        >
          <Save className="h-4 w-4" />
          Salvar
          {isSubmitting && (
            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin ml-2"></div>
          )}
        </Button>
        
        <Button 
          variant="action" 
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl bg-[#f57737] hover:bg-[#e56726]"
        >
          <Wand2 className="h-4 w-4" />
          Gerar Notícia
          {isGenerating && (
            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin ml-2"></div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReleaseForm;
