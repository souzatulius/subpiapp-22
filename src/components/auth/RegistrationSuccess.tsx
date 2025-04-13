
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RegistrationSuccessProps {
  email: string;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ email }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      >
        <CheckCircle className="text-green-500 h-16 w-16 mb-4" />
      </motion.div>
      
      <motion.h2 
        className="text-2xl font-bold mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Cadastro Realizado com Sucesso!
      </motion.h2>
      
      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        Enviamos um email de confirmação para <strong>{email}</strong>. 
        Por favor, verifique sua caixa de entrada e siga as instruções para ativar sua conta.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Ir para Login
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default RegistrationSuccess;
