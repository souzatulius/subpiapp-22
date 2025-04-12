
import React from 'react';
import { motion } from 'framer-motion';

interface GlobalProgressBarProps {
  progress: number;
  isVisible: boolean;
  message?: string;
}

const GlobalProgressBar: React.FC<GlobalProgressBarProps> = ({ progress, isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative h-1 bg-gray-200"
      >
        <motion.div
          className="absolute left-0 top-0 h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      {message && (
        <div className="fixed top-1 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs rounded-full shadow-md">
          {message}
        </div>
      )}
    </div>
  );
};

export default GlobalProgressBar;
