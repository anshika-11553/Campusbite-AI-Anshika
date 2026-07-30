'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserRole } from '@/types/auth';
import { RoleSelector } from './RoleSelector';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail, isValidPassword } from '@/utils/validators';
import { sanitizeInput } from '@/utils/sanitizer';
import { ROLE_ROUTE_MAP, ROUTES } from '@/constants/routes';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [validationErrors, setValidationErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }

    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid university email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (!isValidPassword(password)) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      errors.terms = 'You must agree to the Terms of Service.';
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
      // Execute registration / authentication setup
      await login({
        email: sanitizedEmail,
        password,
        role: selectedRole,
        rememberMe: true,
      });
      // Redirect to designated dashboard
      router.push(ROLE_ROUTE_MAP[selectedRole]);
    } catch {
      // Handled via AuthContext state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

      {error && (
        <Alert variant="error" title="Registration Error">
          {error}
        </Alert>
      )}

      <Input
        label="Full Name"
        type="text"
        placeholder="Alex Morgan"
        value={fullName}
        onChange={(e) => {
          setFullName(e.target.value);
          if (validationErrors.fullName) setValidationErrors((prev) => ({ ...prev, fullName: undefined }));
        }}
        error={validationErrors.fullName}
        leftIcon={<User className="h-4 w-4" />}
        required
      />

      <Input
        label="University Email"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (validationErrors.confirmPassword) setValidationErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          error={validationErrors.confirmPassword}
          leftIcon={<Lock className="h-4 w-4" />}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (validationErrors.terms) setValidationErrors((prev) => ({ ...prev, terms: undefined }));
            }}
            className="rounded border-slate-300 text-[#054A36] focus:ring-[#054A36]"
          />
          <span>
            I agree to CampusBite AI <a href="#" className="text-[#054A36] font-semibold underline">Terms of Service</a> & <a href="#" className="text-[#054A36] font-semibold underline">Privacy Policy</a>
          </span>
        </label>
        {validationErrors.terms && (
          <p className="text-xs text-red-600">{validationErrors.terms}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        rightIcon={<ArrowRight className="h-4 w-4" />}
        className="w-full mt-2 font-semibold text-base py-3"
      >
        Create Account as {selectedRole.toUpperCase()}
      </Button>

      <div className="text-center pt-2 text-xs text-slate-500">
        Already have an account?{' '}
        <Link href={ROUTES.LOGIN} className="font-semibold text-[#054A36] hover:underline">
          Sign In here
        </Link>
      </div>
    </form>
  );
};
