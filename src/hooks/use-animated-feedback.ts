
import { useState, useCallback } from 'react';
import { FeedbackType } from '@/components/ui/animated-feedback';

interface FeedbackOptions {
  duration?: number;
  [key: string]: any;
}

export function useAnimatedFeedback() {
  const [isVisible, setIsVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('success');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [options, setOptions] = useState<FeedbackOptions>({});

  const showFeedback = useCallback((type: FeedbackType, message: string, customOptions: FeedbackOptions = {}) => {
    setFeedbackType(type);
    setFeedbackMessage(message);
    setOptions(customOptions);
    setIsVisible(true);
    
    // Auto-hide after duration if specified
    const duration = customOptions.duration || 2000;
    setTimeout(() => {
      setIsVisible(false);
    }, duration);
  }, []);

  const hideFeedback = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    feedbackType,
    feedbackMessage,
    options,
    showFeedback,
    hideFeedback
  };
}
