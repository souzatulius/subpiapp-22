
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import EmailSuffix from '@/components/EmailSuffix';
import PasswordRequirements from '@/components/PasswordRequirements';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { validatePasswordsMatch, formatPhone, formatDate } from '@/lib/formValidation';
import AuthLayout from '@/components/AuthLayout';

const Register = () => {
  const navigate = useNavigate();
  const { 
    password, 
    setPassword, 
    showRequirements, 
    setShowRequirements,
    requirements,
    isValid: isPasswordValid 
  } = usePasswordValidation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthday: '',
    whatsapp: '',
    role: '',
    area: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Sample data for dropdowns
  const roles = ['Assessor', 'Coordenador', 'Analista', 'Técnico', 'Gestor'];
  const areas = ['Gabinete', 'Comunicação', 'Administração', 'Planejamento', 'Infraestrutura'];
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    // Simulate registration
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Cadastro enviado com sucesso! Verifique seu e-mail para confirmar.');
      navigate('/login');
    }, 1500);
  };
  
  const leftContent = (
    <div className="max-w-xl">
      <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
        <span className="text-subpi-blue">Demandas da nossa SUB</span>
        <br />
        <span className="text-subpi-orange">com eficiência</span>
      </h1>
      
      <p className="text-subpi-gray-secondary text-lg mb-8">
        Sistema integrado para gerenciamento de solicitações da imprensa, controle de projetos urbanos e administração interna da Subprefeitura de Pinheiros.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard type="demandas" />
        <FeatureCard type="acoes" />
        <FeatureCard type="relatorios" />
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <AuthLayout leftContent={leftContent}>
        <div className="h-full flex items-center justify-center p-8">
          <div className="loading-spinner animate-spin"></div>
        </div>
      </AuthLayout>
    );
  }
  
  return (
    <AuthLayout leftContent={leftContent}>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-subpi-gray-text mb-2">Solicitar Acesso</h2>
        <p className="text-subpi-gray-secondary mb-6">Preencha o formulário abaixo para criar sua conta.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-subpi-gray-text mb-1">
                Nome Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`login-input ${errors.name ? 'border-subpi-orange' : ''}`}
                placeholder="Digite seu nome completo"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-subpi-orange">Nome é obrigatório</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-subpi-gray-text mb-1">
                E-mail
              </label>
              <EmailSuffix
                id="email"
                value={formData.email}
                onChange={(value) => {
                  handleChange({
                    target: { name: 'email', value }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                suffix="@smsub.prefeitura.sp.gov.br"
                error={errors.email}
                placeholder="seu.email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-subpi-orange">E-mail é obrigatório</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-subpi-gray-text mb-1">
                  Data de Aniversário
                </label>
                <input
                  id="birthday"
                  name="birthday"
                  type="text"
                  value={formData.birthday}
                  onChange={handleChange}
                  className={`login-input ${errors.birthday ? 'border-subpi-orange' : ''}`}
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                />
                {errors.birthday && (
                  <p className="mt-1 text-sm text-subpi-orange">Data válida é obrigatória</p>
                )}
              </div>
              
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-subpi-gray-text mb-1">
                  WhatsApp
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="text"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={`login-input ${errors.whatsapp ? 'border-subpi-orange' : ''}`}
                  placeholder="(XX) XXXXX-XXXX"
                  maxLength={15}
                />
                {errors.whatsapp && (
                  <p className="mt-1 text-sm text-subpi-orange">WhatsApp é obrigatório</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-subpi-gray-text mb-1">
                  Cargo
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`login-input ${errors.role ? 'border-subpi-orange' : ''}`}
                >
                  <option value="">Selecione seu cargo</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-subpi-orange">Cargo é obrigatório</p>
                )}
              </div>
              
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-subpi-gray-text mb-1">
                  Área de Coordenação
                </label>
                <select
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className={`login-input ${errors.area ? 'border-subpi-orange' : ''}`}
                >
                  <option value="">Selecione sua área</option>
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                {errors.area && (
                  <p className="mt-1 text-sm text-subpi-orange">Área é obrigatória</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-subpi-gray-text mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowRequirements(true)}
                  className={`login-input pr-10 ${errors.password ? 'border-subpi-orange' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              <PasswordRequirements
                requirements={requirements}
                visible={showRequirements && password.length > 0}
              />
              
              {errors.password && !password && (
                <p className="mt-1 text-sm text-subpi-orange">Senha é obrigatória</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-subpi-gray-text mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`login-input pr-10 ${errors.confirmPassword ? 'border-subpi-orange' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-subpi-orange">
                  {!formData.confirmPassword ? 'Confirme sua senha' : 'As senhas não coincidem'}
                </p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="login-button"
            >
              <UserPlus className="mr-2 h-5 w-5" /> Cadastrar
            </button>
          </div>
        </form>
        
        <p className="mt-6 text-center text-sm text-subpi-gray-secondary">
          Já tem uma conta? <a href="/login" className="text-subpi-blue hover:underline">Entrar</a>
        </p>
      </div>
    </AuthLayout>
  );
};

// Importing at the end to avoid circular dependency
import FeatureCard from '@/components/FeatureCard';

export default Register;
