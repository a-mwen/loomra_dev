import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Briefcase, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  
  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      console.log('Password reset requested for:', data.email);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 sm:p-8 transition-colors duration-200">
        {/* Logo and heading */}
        <div className="text-center">
          <div className="flex justify-center">
            <Briefcase className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          
          {!isSubmitted ? (
            <>
              <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Reset password</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mt-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Check your email</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                We've sent a password reset link to your email address
              </p>
            </>
          )}
        </div>
        
        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
            
            <div className="space-y-3">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                variant="primary"
                size="lg"
              >
                Send reset link
              </Button>
              
              <Link to="/login">
                <Button
                  type="button"
                  fullWidth
                  variant="outline"
                  size="lg"
                  leftIcon={<ArrowLeft size={18} />}
                >
                  Back to login
                </Button>
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <div className="space-y-3">
              <Link to="/login">
                <Button
                  type="button"
                  fullWidth
                  variant="primary"
                  size="lg"
                >
                  Return to login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;