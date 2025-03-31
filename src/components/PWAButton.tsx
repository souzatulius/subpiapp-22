
import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';

const PWAButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleInstructions = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        className="fixed bottom-6 right-6 p-3 bg-subpi-orange text-white rounded-full shadow-lg hover:bg-orange-600 focus:outline-none transition-all z-50 flex items-center justify-center hover:scale-105"
        onClick={toggleInstructions}
        aria-label="Adicionar à tela inicial"
      >
        <Smartphone className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={toggleInstructions}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <Smartphone className="h-8 w-8 text-subpi-blue" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">Adicione SubPinheiros ao seu celular</h2>
            <p className="text-center text-gray-600 mb-6">
              Aproveite o acesso rápido como um aplicativo diretamente da tela inicial do seu dispositivo móvel.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="h-6 w-6 rounded-full bg-subpi-blue text-white flex items-center justify-center text-sm font-medium">1</div>
                  <h3 className="ml-2 font-medium">No Chrome</h3>
                </div>
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

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="h-6 w-6 rounded-full bg-subpi-blue text-white flex items-center justify-center text-sm font-medium">2</div>
                  <h3 className="ml-2 font-medium">No Safari</h3>
                </div>
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
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-subpi-blue text-white flex items-center justify-center text-sm font-medium">3</div>
                <p className="ml-2 text-sm">
                  Após adicionar, você poderá acessar o sistema diretamente pelo ícone na tela inicial, como um aplicativo nativo.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button 
                className="bg-subpi-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={toggleInstructions}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAButton;
