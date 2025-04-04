
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X, Info, ArrowUpDown } from 'lucide-react';

const WelcomeMessage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Verificar se é o primeiro acesso do usuário
    const welcomeShown = localStorage.getItem('welcomeMessageShown');
    if (!welcomeShown) {
      setIsVisible(true);
    }
  }, []);
  
  const handleClose = () => {
    setIsVisible(false);
    // Marcar que a mensagem já foi exibida
    localStorage.setItem('welcomeMessageShown', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="col-span-4 mb-6">
      <Card className="bg-blue-50 text-blue-800 border border-blue-200 rounded-xl shadow-md overflow-hidden">
        <CardContent className="p-4 flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <Info className="h-5 w-5" />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between">
              <h3 className="font-medium mb-1">Bem-vindo ao seu Dashboard Personalizado!</h3>
              <button 
                onClick={handleClose}
                className="text-blue-600 hover:text-blue-800 p-1"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm mb-2">
              Você pode organizar esta área como preferir, movendo os cards e personalizando seu painel de trabalho.
            </p>
            <div className="flex items-center text-xs text-blue-600">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              <span>Arraste e solte os cards para reorganizá-los</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeMessage;
