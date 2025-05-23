
import React, { useState } from 'react';
import { Smartphone, ChevronRight, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const PWAButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const totalSteps = 3;

  const toggleInstructions = () => {
    setIsOpen(!isOpen);
    setCurrentStep(1); // Reset to first step when opening
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      toggleInstructions(); // Close if on last step
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  return (
    <div>
      <button 
        className="fixed bottom-6 right-6 p-5 bg-subpi-orange text-white rounded-full shadow-lg hover:bg-orange-600 focus:outline-none transition-all z-50 flex items-center justify-center animate-pulse hover:scale-105"
        style={{
          animation: 'breathing 3s ease-in-out infinite',
        }}
        onClick={toggleInstructions}
        aria-label="Adicionar à tela inicial"
      >
        <Smartphone className="h-8 w-8" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={toggleInstructions}>
          <div 
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden animate-scale-in shadow-xl" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b">
              <div className="flex justify-center mb-3">
                <Smartphone className="h-7 w-7 text-subpi-blue" />
              </div>
              <h2 className="text-xl font-semibold text-center">Use a SubPi como app no celular!</h2>
              
              <div className="flex justify-between mt-4 text-sm">
                <div className="flex items-center">
                  <button 
                    onClick={() => goToStep(1)}
                    className={`h-6 w-6 rounded-full ${currentStep === 1 ? 'bg-orange-500 text-white' : currentStep > 1 ? 'bg-[#003570] text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity`}
                  >
                    1
                  </button>
                  <span className="ml-1 mr-2 text-xs font-medium text-gray-600">Chrome</span>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => goToStep(2)}
                    className={`h-6 w-6 rounded-full ${currentStep === 2 ? 'bg-orange-500 text-white' : currentStep > 2 ? 'bg-[#003570] text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity`}
                  >
                    2
                  </button>
                  <span className="ml-1 mr-2 text-xs font-medium text-gray-600">Safari</span>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => goToStep(3)}
                    className={`h-6 w-6 rounded-full ${currentStep === 3 ? 'bg-orange-500 text-white' : currentStep > 3 ? 'bg-[#003570] text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity`}
                  >
                    3
                  </button>
                  <span className="ml-1 text-xs font-medium text-gray-600">Finalize</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 min-h-[200px] max-h-[60vh] overflow-y-auto">
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <h3 className="text-lg font-medium mb-3">No Chrome</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-subpi-orange mr-2">•</span>
                      <span>Acesse o site no Chrome</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-subpi-orange mr-2">•</span>
                      <span>Toque no menu ⋮ no canto superior direito</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-subpi-orange mr-2">•</span>
                      <span>Selecione "Adicionar à tela inicial"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-subpi-orange mr-2">•</span>
                      <span>Confirme tocando em "Adicionar"</span>
                    </li>
                  </ul>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <h3 className="text-lg font-medium mb-3">No Safari</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-subpi-orange mr-2">•</span>
                      <span>Acesse o site no Safari</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-subpi-orange mr-2">•</span>
                      <span>Toque no ícone compartilhar <span className="text-subpi-gray-secondary">↑</span></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-subpi-orange mr-2">•</span>
                      <span>Role para baixo e selecione "Adicionar à Tela de Início"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-subpi-orange mr-2">•</span>
                      <span>Confirme tocando em "Adicionar"</span>
                    </li>
                  </ul>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <h3 className="text-lg font-medium mb-3">Após adicionar</h3>
                  <p className="text-sm">
                    Após adicionar, você poderá acessar o sistema diretamente pelo ícone na tela inicial, como um aplicativo nativo.
                  </p>
                </div>
              )}
            </div>
            
            <div className="border-t p-4 flex justify-between">
              <button
                onClick={toggleInstructions}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl transition-colors flex items-center gap-2 border border-gray-300 hover:bg-gray-50"
              >
                <X className="h-4 w-4" /> Fechar
              </button>
              <button 
                onClick={goToNextStep}
                className="bg-subpi-blue text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {currentStep === totalSteps ? 'Concluir' : 'Continuar'}
                {currentStep !== totalSteps && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes breathing {
            0% {
              box-shadow: 0 5px 15px rgba(240, 96, 0, 0.4);
              transform: scale(1);
            }
            50% {
              box-shadow: 0 5px 25px rgba(240, 96, 0, 0.6);
              transform: scale(1.05);
            }
            100% {
              box-shadow: 0 5px 15px rgba(240, 96, 0, 0.4);
              transform: scale(1);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default PWAButton;
