
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NotaEditFormProps {
  title: string;
  text: string;
  onTitleChange: (value: string) => void;
  onTextChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const NotaEditForm: React.FC<NotaEditFormProps> = ({
  title,
  text,
  onTitleChange,
  onTextChange,
  onSave,
  onCancel,
  isSubmitting
}) => {
  return (
    <Card className="p-6">
      <div>
        <button 
          onClick={onCancel} 
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Voltar para visualização
        </button>
        
        <h3 className="text-lg font-medium mb-4">Editar Nota Oficial</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conteúdo
            </label>
            <textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              rows={10}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button
              onClick={onSave}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotaEditForm;
