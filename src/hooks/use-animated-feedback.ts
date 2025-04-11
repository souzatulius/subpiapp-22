
import { useState, useCallback } from 'react';
import { FeedbackType } from '@/components/ui/animated-feedback';

export interface FeedbackOptions {
  duration?: number;
  progress?: number;
  stage?: string;
  animate?: boolean;
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
  
  // Added function to update progress
  const updateFeedbackProgress = useCallback((progress: number, message?: string) => {
    setOptions(prev => ({ ...prev, progress }));
    if (message) {
      setFeedbackMessage(message);
    }
  }, []);

  // Added function to update feedback text without showing it again
  const updateFeedbackMessage = useCallback((message: string, type?: FeedbackType) => {
    setFeedbackMessage(message);
    if (type) {
      setFeedbackType(type);
    }
  }, []);

  return {
    isVisible,
    feedbackType,
    feedbackMessage,
    options,
    showFeedback,
    hideFeedback,
    updateFeedbackProgress,
    updateFeedbackMessage
  };
}
