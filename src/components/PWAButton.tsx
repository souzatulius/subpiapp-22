
import React, { useEffect, useState } from 'react';
import { ArrowDownToLine } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const PWAButton: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show the install button
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      console.log('No install prompt available');
      return;
    }

    // Show the install prompt
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowInstallButton(false);
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the prompt reference
    setInstallPrompt(null);
  };

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
