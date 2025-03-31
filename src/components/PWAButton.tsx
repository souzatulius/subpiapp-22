
import React from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

const PWAButton: React.FC = () => {
  const { showInstallButton, handleInstall } = useInstallPrompt();

  if (!showInstallButton) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-6 right-6 bg-[#003570] text-white p-8 rounded-full shadow-lg z-50 hover:bg-[#002855] transform transition-transform duration-300 animate-pulse"
      aria-label="Instalar aplicativo"
    >
      <ArrowDownToLine className="h-8 w-8" />
    </button>
  );
};

export default PWAButton;
