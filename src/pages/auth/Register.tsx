import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Briefcase, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { RegisterData } from '../../types';

const Register: React.FC = () => {
  const { register: registerUser, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterData & { confirmPassword: string }>();
  const password = watch('password', '');
  
  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    const { confirmPassword, ...registerData } = data;
    clearError();
    const success = await registerUser(registerData);
    if (success) {
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 sm:p-8 transition-colors duration-200">
        {/* Logo and heading */}
        <div className="text-center">
          <div className="flex justify-center">
            <Briefcase className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Create an account</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join Loomra to start managing your clients and tasks
          </p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 animate-fade-in">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Registration form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="First name"
                autoComplete="given-name"
                leftIcon={<User size={18} />}
                error={errors.firstName?.message}
                required
                {...register('firstName', { 
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters'
                  }
                })}
              />
              
              <Input
                label="Last name"
                autoComplete="family-name"
                leftIcon={<User size={18} />}
                error={errors.lastName?.message}
                required
                {...register('lastName', { 
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters'
                  }
                })}
              />
            </div>
            
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              required
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                }
              })}
            />
            
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              leftIcon={<Lock size={18} />}
              error={errors.password?.message}
              required
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
                  message: 'Password must include uppercase, lowercase, number and special character'
                }
              })}
            />
            
            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              leftIcon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              required
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
          </div>
          
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            variant="primary"
            size="lg"
          >
            Create account
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;