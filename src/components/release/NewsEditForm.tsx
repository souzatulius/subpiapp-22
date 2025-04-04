
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { GeneratedNews } from './types';

interface NewsEditFormProps {
  generatedNews: GeneratedNews | null;
  setGeneratedNews: (news: GeneratedNews | null) => void;
  setIsEditingNews: (editing: boolean) => void;
  handleSaveNews: () => void;
  isSavingRelease: boolean;
}

const NewsEditForm: React.FC<NewsEditFormProps> = ({
  generatedNews,
  setGeneratedNews,
  setIsEditingNews,
  handleSaveNews,
  isSavingRelease
}) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Editar Notícia Gerada</h2>
      
      <div className="mb-4">
        <label htmlFor="news-title" className="block text-sm font-medium text-gray-700 mb-1">
          Título da Notícia
        </label>
        <input
          id="news-title"
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={generatedNews?.titulo || ''}
          onChange={(e) => setGeneratedNews(prev => prev ? {...prev, titulo: e.target.value} : null)}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="news-content" className="block text-sm font-medium text-gray-700 mb-1">
          Conteúdo da Notícia
        </label>
        <Textarea
          id="news-content"
          className="min-h-[300px]"
          value={generatedNews?.conteudo || ''}
          onChange={(e) => setGeneratedNews(prev => prev ? {...prev, conteudo: e.target.value} : null)}
        />
      </div>
      
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => setIsEditingNews(false)}
        >
          Voltar
        </Button>
        <Button 
          onClick={handleSaveNews}
          disabled={isSavingRelease}
        >
          {isSavingRelease ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar Notícia
        </Button>
      </div>
    </>
  );
};

export default NewsEditForm;
