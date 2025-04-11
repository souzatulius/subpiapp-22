
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

type FeedbackType = 'success' | 'error' | 'warning' | 'info';

export const useAnimatedFeedback = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { toast: uiToast } = useToast();

  const showFeedback = useCallback((type: FeedbackType, message: string, options?: any) => {
    setIsVisible(true);

    // Show toast using sonner (for overlay effects)
    if (type === 'success') {
      toast.success(message, options);
    } else if (type === 'error') {
      toast.error(message, options);
    } else if (type === 'warning') {
      toast.warning(message, options);
    } else {
      toast.info(message, options);
    }

    // Also show shadcn toast for accessibility
    uiToast({
      variant: type === 'info' ? 'default' : type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
      ...options
    });

    // Auto-hide after duration
    setTimeout(() => {
      setIsVisible(false);
    }, options?.duration || 3000);
  }, [uiToast]);

  return {
    showFeedback,
    isVisible,
  };
};
