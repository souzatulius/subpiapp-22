
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle2, XCircle, AlertCircle, FileX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadWithProgressProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  isLoading?: boolean;
  progress?: number;
  label?: string;
  helperText?: string;
  disabled?: boolean;
}

const FileUploadWithProgress: React.FC<FileUploadWithProgressProps> = ({ 
  onFileSelected, 
  accept = ".xlsx,.xls", 
  maxSize = 10, 
  isLoading = false, 
  progress = 0,
  label = "Selecionar arquivo",
  helperText = "Clique para selecionar ou arraste o arquivo",
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Reset state when disabled prop or isLoading changes
  useEffect(() => {
    if (disabled || isLoading) {
      // Don't clear the file when loading, only when disabled or done loading
      if (disabled || (isLoading === false && progress === 100)) {
        setSelectedFile(null);
        setError(null);
        
        // Clear the input value to allow selecting the same file again
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    }
  }, [disabled, isLoading, progress]);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const validTypes = accept.split(',').map(type => 
      type.trim().startsWith('.') ? type.trim().substring(1) : type.trim()
    );
    
    if (!fileExt || !validTypes.includes(fileExt)) {
      setError(`Tipo de arquivo inválido. Aceitos: ${accept}`);
      toast({
        title: "Erro de formato",
        description: `Tipo de arquivo inválido. Aceitos: ${accept}`,
        variant: "destructive"
      });
      return false;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      toast({
        title: "Erro de tamanho",
        description: `Arquivo muito grande. Tamanho máximo: ${maxSize}MB`,
        variant: "destructive"
      });
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };
  
  const handleFile = (file: File) => {
    console.log("File selected:", file.name);
    
    if (validateFile(file)) {
      setSelectedFile(file);
      // Call the parent's onFileSelected directly
      onFileSelected(file);
    }
    
    // Always clear the input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  const handleClick = () => {
    if (inputRef.current && !disabled && !isLoading) {
      inputRef.current.click();
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    // Notify parent that file has been cleared
    onFileSelected(null);
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} 
          ${error ? 'border-red-300 bg-red-50' : ''} 
          ${isLoading ? 'opacity-70 pointer-events-none' : ''} 
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={disabled || isLoading ? undefined : handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={isLoading || disabled}
        />
        
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center text-blue-500">
              <Upload className="h-10 w-10 animate-pulse" />
            </div>
            <p className="text-sm text-gray-500">Processando arquivo...</p>
            <div className="w-full space-y-1">
              <Progress value={progress} className="w-full h-2" />
              <p className="text-xs text-right text-gray-500">{progress}%</p>
            </div>
          </div>
        ) : selectedFile && !error ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center text-green-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            {!disabled && (
              <Button size="sm" variant="outline" onClick={handleClearFile}>
                Selecionar outro arquivo
              </Button>
            )}
          </div>
        ) : error ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center text-red-500">
              <XCircle className="h-10 w-10" />
            </div>
            <p className="text-red-600 font-medium">Erro no arquivo</p>
            <p className="text-sm text-red-500">{error}</p>
            {!disabled && (
              <Button size="sm" variant="outline" className="border-red-200 text-red-700" onClick={handleClearFile}>
                Tentar novamente
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center text-gray-400">
              {disabled ? (
                <AlertCircle className="h-10 w-10" />
              ) : (
                <Upload className="h-10 w-10" />
              )}
            </div>
            <p className="font-medium">{label}</p>
            <p className="text-sm text-gray-500">{disabled ? "Upload desativado" : helperText}</p>
            {accept && (
              <p className="text-xs text-gray-400">
                Formatos aceitos: {accept}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadWithProgress;
