
import { useState, useEffect } from 'react';

export const usePasswordValidation = () => {
  const [password, setPassword] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  useEffect(() => {
    // Check individual password requirements
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    setRequirements({
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    });
    
    // Check if all requirements are met
    const valid = minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    setIsValid(valid);
  }, [password]);

  return {
    password,
    setPassword,
    showRequirements,
    setShowRequirements,
    requirements,
    isValid
  };
};
