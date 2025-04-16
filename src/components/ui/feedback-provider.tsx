
import React from 'react';
import AnimatedFeedback from './animated-feedback';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

export const FeedbackContext = React.createContext<ReturnType<typeof useAnimatedFeedback> | undefined>(undefined);

export const useFeedback = () => {
  const context = React.useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const feedbackState = useAnimatedFeedback();
  
  return (
    <FeedbackContext.Provider value={feedbackState}>
      {children}
      <AnimatedFeedback
        visible={feedbackState.isVisible}
        type={feedbackState.feedbackType}
        message={feedbackState.feedbackMessage}
        onClose={feedbackState.hideFeedback}
        options={feedbackState.options}
      />
    </FeedbackContext.Provider>
  );
};

export default FeedbackProvider;
