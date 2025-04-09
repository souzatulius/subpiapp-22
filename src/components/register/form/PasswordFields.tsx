
import React from 'react';
import { Input } from '@/components/ui/input';
import PasswordRequirement from '@/components/PasswordRequirement';

interface PasswordFieldsProps {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  showRequirements: boolean;
  setShowRequirements: (show: boolean) => void;
  requirements: Record<string, boolean>;
  errors: Record<string, boolean>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordFields: React.FC<PasswordFieldsProps> = ({
  password,
  setPassword,
  confirmPassword,
  showRequirements,
  setShowRequirements,
  requirements,
  errors,
  handleChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-1">
          Senha
        </label>
        <Input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setShowRequirements(true)}
          className={errors.password ? 'border-[#f57b35] focus:ring-[#f57b35]' : ''}
          placeholder="Digite sua senha"
        />
        {errors.password && <p className="mt-1 text-sm text-[#f57b35]">Senha inválida</p>}
        
        {showRequirements && (
          <div className="mt-2 rounded-md p-2 bg-gray-50">
            <p className="text-xs text-gray-600 mb-1">Sua senha deve conter:</p>
            <div className="space-y-1">
              <PasswordRequirement
                fulfilled={requirements.minLength}
                label="Pelo menos 8 caracteres"
              />
              <PasswordRequirement
                fulfilled={requirements.hasUppercase}
                label="Pelo menos 1 letra maiúscula"
              />
              <PasswordRequirement
                fulfilled={requirements.hasLowercase}
                label="Pelo menos 1 letra minúscula"
              />
              <PasswordRequirement
                fulfilled={requirements.hasNumber}
                label="Pelo menos 1 número"
              />
              <PasswordRequirement
                fulfilled={requirements.hasSpecialChar}
                label="Pelo menos 1 caractere especial"
              />
            </div>
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#111827] mb-1">
          Confirmar senha
        </label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          className={errors.confirmPassword ? 'border-[#f57b35] focus:ring-[#f57b35]' : ''}
          placeholder="Confirme sua senha"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-[#f57b35]">As senhas não conferem</p>
        )}
      </div>
    </div>
  );
};

export default PasswordFields;
