import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import EmailSuffix from '@/components/EmailSuffix';
import PasswordRequirements from '@/components/PasswordRequirements';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { validatePasswordsMatch, formatPhone, formatDate } from '@/lib/formValidation';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { showAuthError, completeEmailWithDomain } from '@/lib/authUtils';
interface RegisterFormProps {
  roles: SelectOption[];
  areas: SelectOption[];
  loadingOptions: boolean;
}
export interface FormData {
  name: string;
  email: string;
  birthday: string;
  whatsapp: string;
  role: string;
  area: string;
  confirmPassword: string;
}
export interface SelectOption {
  id: string;
  value: string;
}
const RegisterForm: React.FC<RegisterFormProps> = ({
  roles,
  areas,
  loadingOptions
}) => {
  const navigate = useNavigate();
  const {
    password,
    setPassword,
    showRequirements,
    setShowRequirements,
    requirements,
    isValid: isPasswordValid
  } = usePasswordValidation();
  const {
    signUp
  } = useAuth();
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
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
      const {
        error
      } = await signUp(completeEmail, password, {
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
  if (loading) {
    return <div className="h-full flex items-center justify-center p-8">
        <div className="loading-spinner animate-spin"></div>
      </div>;
  }
  return <div className="bg-white rounded-lg shadow-lg p-8 w-full px-[15px] py-[15px]">
      <h2 className="text-2xl font-bold text-[#111827] mb-2">Solicitar Acesso</h2>
      <p className="text-[#6B7280] mb-6">Preencha o formulário abaixo para criar sua conta.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-1">
              Nome Completo
            </label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.name ? 'border-[#f57b35]' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200`} placeholder="Digite seu nome completo" />
            {errors.name && <p className="mt-1 text-sm text-[#f57b35]">Nome é obrigatório</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">
              E-mail
            </label>
            <EmailSuffix id="email" value={formData.email} onChange={value => {
            handleChange({
              target: {
                name: 'email',
                value
              }
            } as React.ChangeEvent<HTMLInputElement>);
          }} suffix="@smsub.prefeitura.sp.gov.br" error={errors.email} placeholder="seu.email" />
            {errors.email && <p className="mt-1 text-sm text-[#f57b35]">E-mail é obrigatório</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="birthday" className="block text-sm font-medium text-[#111827] mb-1">
                Data de Aniversário
              </label>
              <input id="birthday" name="birthday" type="text" value={formData.birthday} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.birthday ? 'border-[#f57b35]' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200`} placeholder="DD/MM/AAAA" maxLength={10} />
              {errors.birthday && <p className="mt-1 text-sm text-[#f57b35]">Data válida é obrigatória</p>}
            </div>
            
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-[#111827] mb-1">
                WhatsApp
              </label>
              <input id="whatsapp" name="whatsapp" type="text" value={formData.whatsapp} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.whatsapp ? 'border-[#f57b35]' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200`} placeholder="(XX) XXXXX-XXXX" maxLength={15} />
              {errors.whatsapp && <p className="mt-1 text-sm text-[#f57b35]">WhatsApp é obrigatório</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[#111827] mb-1">
                Cargo
              </label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.role ? 'border-[#f57b35]' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200`} disabled={loadingOptions}>
                <option value="">Selecione seu cargo</option>
                {roles.map(role => <option key={role.id} value={role.value}>{role.value}</option>)}
              </select>
              {errors.role && <p className="mt-1 text-sm text-[#f57b35]">Cargo é obrigatório</p>}
            </div>
            
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-[#111827] mb-1">
                Área de Coordenação
              </label>
              <select id="area" name="area" value={formData.area} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.area ? 'border-[#f57b35]' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200`} disabled={loadingOptions}>
                <option value="">Selecione sua área</option>
                {areas.map(area => <option key={area.id} value={area.value}>{area.value}</option>)}
              </select>
              {errors.area && <p className="mt-1 text-sm text-[#f57b35]">Área é obrigatória</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-1">
              Senha
            </label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setShowRequirements(true)} className={`w-full px-4 py-2 border ${errors.password ? 'border-[#f57b35]' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200 pr-10`} placeholder="••••••••" />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            
            <PasswordRequirements requirements={requirements} visible={showRequirements && password.length > 0} />
            
            {errors.password && !password && <p className="mt-1 text-sm text-[#f57b35]">Senha é obrigatória</p>}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#111827] mb-1">
              Confirmar Senha
            </label>
            <div className="relative">
              <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-[#f57b35]' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200 pr-10`} placeholder="••••••••" />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-[#f57b35]">
                {!formData.confirmPassword ? 'Confirme sua senha' : 'As senhas não coincidem'}
              </p>}
          </div>
          
          <button type="submit" className="w-full bg-[#003570] text-white py-3 px-4 hover:bg-blue-900 transition-all duration-200 flex items-center justify-center font-medium rounded-2xl">
            <UserPlus className="mr-2 h-5 w-5" /> Cadastrar
          </button>
        </div>
      </form>
      
      <p className="mt-6 text-center text-sm text-[#6B7280]">
        Já tem uma conta? <Link to="/login" className="text-[#f57c35] hover:underline">Entrar</Link>
      </p>
    </div>;
};
export default RegisterForm;