
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface AttachmentsSectionProps {
  anexos: string[];
  onAnexosChange: (files: string[]) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  anexos,
  onAnexosChange,
  onFileUpload
}) => {
  const removeAnexo = (index: number) => {
    const newAnexos = [...anexos];
    newAnexos.splice(index, 1);
    onAnexosChange(newAnexos);
  };

  return (
    <div>
      <Label htmlFor="anexos" className="block mb-2">
        Anexos
      </Label>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = e.dataTransfer.files;
              if (files && files.length > 0) {
                const changeEvent = {
                  target: { files }
                } as React.ChangeEvent<HTMLInputElement>;
                onFileUpload(changeEvent);
              }
            }}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V8m0 0-3 3m3-3 3 3"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
              <p className="text-xs text-gray-500">Formatos: PNG, JPG, PDF, DOCX, XLSX (MAX 10MB)</p>
            </div>
            <input 
              id="dropzone-file" 
              type="file" 
              className="hidden" 
              multiple 
              onChange={onFileUpload} 
            />
          </label>
        </div>
        
        {anexos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {anexos.map((anexo, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-xl bg-gray-50">
                <div className="truncate flex-1">
                  {typeof anexo === 'string' ? anexo.split('/').pop() : ''}
                </div>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => removeAnexo(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentsSection;
