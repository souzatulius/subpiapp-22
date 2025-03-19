
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { validatePasswordsMatch, formatPhone, formatDate } from '@/lib/formValidation';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { showAuthError, completeEmailWithDomain } from '@/lib/authUtils';
import { FormData } from '../types';

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { password, setPassword, showRequirements, setShowRequirements, requirements, isValid: isPasswordValid } = usePasswordValidation();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    birthday: '',
    whatsapp: '',
    role: '',
    area: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Apply formatting for specific fields
    if (name === 'whatsapp') {
      processedValue = formatPhone(value);
    } else if (name === 'birthday') {
      processedValue = formatDate(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear the error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, boolean> = {};

    // Check required fields
    if (!formData.name) newErrors.name = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.birthday) newErrors.birthday = true;
    if (!formData.whatsapp) newErrors.whatsapp = true;
    if (!formData.role) newErrors.role = true;
    if (!formData.area) newErrors.area = true;
    if (!password) newErrors.password = true;
    if (!formData.confirmPassword) newErrors.confirmPassword = true;

    // Password validation
    if (!isPasswordValid) newErrors.password = true;

    // Check if passwords match
    if (!validatePasswordsMatch(password, formData.confirmPassword)) {
      newErrors.confirmPassword = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const completeEmail = completeEmailWithDomain(formData.email);
      const { error } = await signUp(completeEmail, password, {
        nome_completo: formData.name,
        aniversario: formData.birthday,
        whatsapp: formData.whatsapp,
        cargo: formData.role,
        area: formData.area
      });

      if (error) {
        showAuthError(error);
      } else {
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      showAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    password,
    setPassword,
    showRequirements,
    setShowRequirements,
    requirements,
    errors,
    loading,
    handleChange,
    handleSubmit
  };
};
