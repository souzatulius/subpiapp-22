
import { useState, useCallback, useEffect, useRef } from 'react';
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showFeedback = useCallback((type: FeedbackType, message: string, customOptions: FeedbackOptions = {}) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setFeedbackType(type);
    setFeedbackMessage(message);
    setOptions(customOptions);
    setIsVisible(true);
    
    // Auto-hide after duration if specified and not loading type
    const duration = customOptions.duration ?? (type === 'loading' ? 0 : 3000);
    if (duration > 0 && type !== 'loading') {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, duration);
    }
  }, []);

  const hideFeedback = useCallback(() => {
    setIsVisible(false);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
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
