
import { create } from 'zustand';
import { FeedbackType } from '@/components/ui/animated-feedback';

interface FeedbackState {
  visible: boolean;
  type: FeedbackType;
  message: string;
  showFeedback: (type: FeedbackType, message: string) => void;
  hideFeedback: () => void;
}

export const useAnimatedFeedback = create<FeedbackState>((set) => ({
  visible: false,
  type: 'success',
  message: '',
  
  showFeedback: (type, message) => set({
    visible: true,
    type,
    message
  }),
  
  hideFeedback: () => set({ visible: false })
}));
