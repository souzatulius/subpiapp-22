
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import EmailSuffix from '@/components/EmailSuffix';
import { Input } from '@/components/ui/input';

interface LoginFormFieldsProps {
  email: string;
  password: string;
  emailError: boolean;
  passwordError: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  email,
  password,
  emailError,
  passwordError,
  onEmailChange,
  onPasswordChange
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">E-mail</label>
        <EmailSuffix
          id="email"
          value={email}
          onChange={onEmailChange}
          error={emailError}
        />
        {emailError && <p className="text-sm text-[#f57b35]">E-mail é obrigatório</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-1">Senha</label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => onPasswordChange(e.target.value)}
            className={`pr-10 ${passwordError ? 'border-[#f57b35] focus:ring-[#f57b35]' : ''}`}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
        {passwordError && <p className="mt-1 text-sm text-[#f57b35]">Senha é obrigatória</p>}
        <div className="mt-2">
          <Link to="/forgot-password" className="text-[#f57c35] font-semibold hover:underline">Esqueceu sua senha?</Link>
        </div>
      </div>
    </>
  );
};

export default LoginFormFields;
