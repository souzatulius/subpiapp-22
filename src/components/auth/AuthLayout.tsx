
import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {children}
      </motion.div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background: linear-gradient(to right, #EBF4FF, #EDF2F7);
          min-height: 100vh;
        }
      `}} />
    </div>
  );
};

export default AuthLayout;
