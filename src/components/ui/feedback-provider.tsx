
import React, { useState } from 'react';
import AnimatedFeedback, { FeedbackType } from './animated-feedback';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showFeedback, isVisible } = useAnimatedFeedback();
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('success');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Create a wrapper function to capture the feedback data
  const handleShowFeedback = (type: FeedbackType, message: string, options?: any) => {
    setFeedbackType(type);
    setFeedbackMessage(message);
    showFeedback(type, message, options);
  };

  const handleHideFeedback = () => {
    // This could be expanded if needed
  };
  
  return (
    <>
      {children}
      <AnimatedFeedback
        visible={isVisible}
        type={feedbackType}
        message={feedbackMessage}
        onClose={handleHideFeedback}
        duration={2000}
      />
    </>
  );
};

export default FeedbackProvider;
