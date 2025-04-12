
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

interface CleanDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CleanDataDialog: React.FC<CleanDataDialogProps> = ({ 
  isOpen, 
  onClose,
  onSuccess
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showFeedback } = useAnimatedFeedback();

  const handleCleanData = async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Call the database function to clean up all data
      // Use any type to bypass the TypeScript check since the function exists in the DB
      // but might not be in the TypeScript types
      const { data, error } = await supabase.rpc('clean_zeladoria_data' as any);
      
      if (error) {
        console.error('Error cleaning data:', error);
        setError(`Erro ao limpar dados: ${error.message}`);
        showFeedback('error', `Erro ao limpar dados: ${error.message}`, { duration: 3000 });
        return;
      }
      
      // Success
      showFeedback('success', 'Dados limpos com sucesso', { duration: 2000 });
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error('Error in clean data operation:', err);
      setError(`Erro inesperado: ${err.message}`);
      showFeedback('error', `Erro inesperado: ${err.message}`, { duration: 3000 });
    } finally {
      setIsProcessing(false);
      setIsConfirming(false);
    }
  };
  
  const handleCancel = () => {
    setIsConfirming(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {isConfirming ? (
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            ) : (
              <Trash2 className="h-6 w-6 text-gray-500 mr-2" />
            )}
            {isConfirming ? 'Confirmação de Exclusão' : 'Limpar Dados'}
          </DialogTitle>
          
          <DialogDescription>
            {isConfirming ? (
              <span className="text-red-500 font-medium">
                ATENÇÃO: Esta ação excluirá TODOS os dados de uploads do Painel da Zeladoria e SGZ.
                Esta ação não pode ser desfeita.
              </span>
            ) : (
              'Esta ação removerá todos os dados carregados do Painel da Zeladoria e SGZ.'
            )}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isProcessing}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
          
          <Button 
            variant={isConfirming ? "destructive" : "default"}
            onClick={handleCleanData}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin mr-1">⏳</span>
                Processando...
              </>
            ) : isConfirming ? (
              <>
                <Trash2 className="h-4 w-4 mr-1" />
                Confirmar Exclusão
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Limpar Dados
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CleanDataDialog;
