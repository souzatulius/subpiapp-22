
import React from 'react';
import AnimatedFeedback from './animated-feedback';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { visible, type, message, hideFeedback } = useAnimatedFeedback();
  
  return (
    <>
      {children}
      <AnimatedFeedback
        visible={visible}
        type={type}
        message={message}
        onClose={hideFeedback}
        duration={2000}
      />
    </>
  );
};

export default FeedbackProvider;
