'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, socialLogin, error: authError, loading: authLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Set isMounted to true after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const onSubmit = useCallback(async (data: LoginFormValues) => {
    if (!isMounted) return;
    
    try {
      setIsSubmitting(true);
      const success = await login(data.email, data.password);
      
      if (success) {
        // Use Next.js router for navigation
        router.push('/dashboard');
      } else {
        setError('root', {
          type: 'manual',
          message: 'Invalid email or password',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('root', {
        type: 'manual',
        message: 'An error occurred during login. Please try again.',
      });
    } finally {
      if (isMounted) {
        setIsSubmitting(false);
      }
    }
  }, [isMounted, login, router, setError]);
  
  const handleSocialLogin = useCallback(async (provider: string) => {
    if (!isMounted) return;
    
    try {
      setIsSubmitting(true);
      await socialLogin(provider);
      router.push('/dashboard');
    } catch (error) {
      console.error(`${provider} login error:`, error);
      // Error is handled in the auth context
    } finally {
      if (isMounted) {
        setIsSubmitting(false);
      }
    }
  }, [isMounted, router, socialLogin]);

  // Don't render anything during server-side rendering
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const loading = authLoading || isSubmitting;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => router.push('/reset-password')}
                type="button"
              >
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {(error || errors.root) && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {errors.root?.message || authError || 'An error occurred during login'}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in with Email'
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
            >
              Facebook
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => router.push('/register')}
          >
            Sign up
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
