
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { validatePasswordsMatch, formatPhone, formatDate } from '@/lib/formValidation';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { showAuthError, completeEmailWithDomain } from '@/lib/authUtils';
import { toast } from 'sonner';

export interface FormData {
  name: string;
  email: string;
  birthday: string;
  whatsapp: string;
  role: string;
  area: string;
  coordenacao: string;
  confirmPassword: string;
}

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
    coordenacao: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string, value?: string) => {
    // Handle both event-based changes and direct value changes from the Select component
    if (typeof e === 'string' && value !== undefined) {
      // This is from the Select component
      const name = e;
      
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear the error for this field if it exists
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: false
        }));
      }
    } else if (typeof e === 'object' && 'target' in e) {
      // This is from a regular input element
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
    }
  };

  const isCoordinationRole = () => {
    // Get the role object from its ID
    const selectedRoleId = formData.role;
    return selectedRoleId && selectedRoleId.toLowerCase().includes('coordenação');
  };

  const isManagerRole = () => {
    // Get the role object from its ID
    const selectedRoleId = formData.role;
    return selectedRoleId && selectedRoleId.toLowerCase().includes('gestor');
  };

  const coordinationHasSupervisions = async (): Promise<boolean> => {
    if (!formData.coordenacao) return false;
    
    try {
      const { data, error } = await fetch(
        `/api/has-supervisions?coordenacao_id=${formData.coordenacao}`
      ).then(res => res.json());
      
      if (error) return false;
      return !!data && data.hasSupervisions;
    } catch (error) {
      console.error('Error checking supervisions:', error);
      return false;
    }
  };

  const validate = async () => {
    const newErrors: Record<string, boolean> = {};

    // Check required fields
    if (!formData.name) newErrors.name = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.birthday) newErrors.birthday = true;
    if (!formData.whatsapp) newErrors.whatsapp = true;
    if (!formData.role) newErrors.role = true;
    if (!formData.coordenacao) newErrors.coordenacao = true;
    
    // Check if coordination role or manager role is selected - no need for supervision in this case
    const isCoordination = isCoordinationRole();
    const isManager = isManagerRole();
    
    // For team roles, check if coordination has supervisions
    if (!isCoordination && !isManager && !formData.area) {
      // Only mark area as required if the coordination has supervisions
      const hasSupervisions = await coordinationHasSupervisions();
      if (hasSupervisions) {
        newErrors.area = true;
      }
    }
    
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
    const isValid = await validate();
    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const completeEmail = completeEmailWithDomain(formData.email);
      
      // For coordination or manager roles, no supervisao_tecnica_id is needed
      const isCoordination = isCoordinationRole();
      const isManager = isManagerRole();
      
      const { error } = await signUp(completeEmail, password, {
        nome_completo: formData.name,
        aniversario: formData.birthday,
        whatsapp: formData.whatsapp,
        cargo_id: formData.role,
        supervisao_tecnica_id: (isCoordination || isManager) ? null : formData.area || null,
        coordenacao_id: formData.coordenacao
      });

      if (error) {
        showAuthError(error);
      } else {
        toast.success("Registro enviado com sucesso. Seu acesso será aprovado por um administrador.");
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
