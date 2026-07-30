'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/auth';
import { RoleSelector } from './RoleSelector';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail, isValidPassword } from '@/utils/validators';
import { sanitizeInput } from '@/utils/sanitizer';
import { ROLE_ROUTE_MAP } from '@/constants/routes';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address (e.g. user@college.edu).';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (!isValidPassword(password)) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      const sanitizedEmail = sanitizeInput(email);
      await login({
        email: sanitizedEmail,
        password,
        role: selectedRole,
        rememberMe,
      });
      // Successful login -> Redirect to role route
      router.push(ROLE_ROUTE_MAP[selectedRole]);
    } catch {
      // Error handled via AuthContext state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

      {error && (
        <Alert variant="error" title="Authentication Error">
          {error}
        </Alert>
      )}

      <Input
        label="Email Address"
        type="email"
        placeholder="student@college.edu"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (validationErrors.email) setValidationErrors((prev) => ({ ...prev, email: undefined }));
        }}
        error={validationErrors.email}
        leftIcon={<Mail className="h-4 w-4" />}
        required
      />

      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (validationErrors.password) setValidationErrors((prev) => ({ ...prev, password: undefined }));
        }}
        error={validationErrors.password}
        leftIcon={<Lock className="h-4 w-4" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        required
      />

      <div className="flex items-center justify-between text-xs sm:text-sm">
        <label className="flex items-center gap-2 cursor-pointer text-slate-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-slate-300 text-[#054A36] focus:ring-[#054A36]"
          />
          Remember me
        </label>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert('Password reset instructions will be provided in future updates.');
          }}
          className="font-medium text-[#054A36] hover:underline"
        >
          Forgot Password?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        rightIcon={<ArrowRight className="h-4 w-4" />}
        className="w-full mt-2 font-semibold text-base py-3"
      >
        Sign In as {selectedRole.toUpperCase()}
      </Button>

      <div className="text-center pt-2 text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="font-semibold text-[#054A36] hover:underline">
          Create Account
        </a>
      </div>
    </form>
  );
};
