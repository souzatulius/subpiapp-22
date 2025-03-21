
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import PasswordRequirements from '@/components/PasswordRequirements';
import { Input } from '@/components/ui/input';

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  setPassword: (password: string) => void;
  setShowRequirements: (show: boolean) => void;
  showRequirements: boolean;
  requirements: {
    min: boolean;
    uppercase: boolean;
    number: boolean;
  };
  errors: Record<string, boolean>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PasswordFields: React.FC<PasswordFieldsProps> = ({
  password,
  confirmPassword,
  setPassword,
  setShowRequirements,
  showRequirements,
  requirements,
  errors,
  handleChange
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-1">
          Senha
        </label>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            onFocus={() => setShowRequirements(true)} 
            className={`pr-10 ${errors.password ? 'border-[#f57b35] ring-[#f57b35]' : ''}`} 
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
        
        <PasswordRequirements requirements={requirements} visible={showRequirements && password.length > 0} />
        
        {errors.password && !password && <p className="mt-1 text-sm text-[#f57b35]">Senha é obrigatória</p>}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#111827] mb-1">
          Confirmar Senha
        </label>
        <div className="relative">
          <Input 
            id="confirmPassword" 
            name="confirmPassword" 
            type={showConfirmPassword ? 'text' : 'password'} 
            value={confirmPassword} 
            onChange={handleChange} 
            className={`pr-10 ${errors.confirmPassword ? 'border-[#f57b35] ring-[#f57b35]' : ''}`} 
            placeholder="••••••••" 
          />
          <button 
            type="button" 
            className="absolute inset-y-0 right-0 pr-3 flex items-center" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-[#f57b35]">
            {!confirmPassword ? 'Confirme sua senha' : 'As senhas não coincidem'}
          </p>}
      </div>
    </>
  );
};

export default PasswordFields;
