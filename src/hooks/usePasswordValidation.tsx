
import { useState, useEffect } from 'react';
import { validatePassword } from '@/lib/formValidation';

export const usePasswordValidation = () => {
  const [password, setPassword] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  const [requirements, setRequirements] = useState({
    min: false,
    uppercase: false,
    number: false
  });

  useEffect(() => {
    if (password) {
      const validation = validatePassword(password);
      setRequirements({
        min: validation.min,
        uppercase: validation.uppercase,
        number: validation.number
      });
    }
  }, [password]);

  return {
    password,
    setPassword,
    showRequirements,
    setShowRequirements,
    requirements,
    isValid: requirements.min && requirements.uppercase && requirements.number
  };
};
