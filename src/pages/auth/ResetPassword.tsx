import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<'validating' | 'valid' | 'expired' | 'used' | 'invalid'>('validating');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  useEffect(() => {
    // Simulate token validation
    const validateToken = async () => {
      const token = searchParams.get('token');
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!token) {
        setTokenStatus('invalid');
        return;
      }

      // Mock token validation - in reality this would be a backend check
      const mockTokenAge = Math.random();
      if (mockTokenAge < 0.2) {
        setTokenStatus('expired');
      } else if (mockTokenAge < 0.3) {
        setTokenStatus('used');
      } else {
        setTokenStatus('valid');
      }
    };

    validateToken();
  }, [searchParams]);

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('one special character');
    
    if (errors.length > 0) {
      return `Password must contain ${errors.join(', ')}`;
    }
    return '';
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return null;
    
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const passed = Object.values(checks).filter(Boolean).length;
    
    return {
      strength: passed === 5 ? 'strong' : passed >= 3 ? 'medium' : 'weak',
      checks,
    };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(password);
    const confirmError = password !== confirmPassword ? 'Passwords do not match' : '';
    
    if (passwordError || confirmError) {
      setErrors({ password: passwordError, confirmPassword: confirmError });
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);

    toast({
      title: 'Password reset successful',
      description: 'Your password has been updated. You can now login with your new password.',
    });

    navigate('/auth/login');
  };

  if (tokenStatus === 'validating') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (tokenStatus === 'expired') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Token expired</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This password reset link has expired. Links are valid for 4 hours.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8 shadow-sm text-center">
            <Link to="/auth/forgot-password">
              <Button className="w-full">Request new reset link</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (tokenStatus === 'used') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Token already used</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This password reset link has already been used.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8 shadow-sm space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              If you still need to reset your password, please request a new link.
            </p>
            <Link to="/auth/forgot-password">
              <Button className="w-full">Request new reset link</Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="outline" className="w-full">Back to login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (tokenStatus === 'invalid') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Invalid link</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This password reset link is invalid or malformed.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8 shadow-sm text-center">
            <Link to="/auth/forgot-password">
              <Button className="w-full">Request new reset link</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reset your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
              
              {strength && (
                <div className="space-y-2 rounded-md border border-border bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      strength.strength === 'strong' ? 'text-green-600' :
                      strength.strength === 'medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {strength.strength.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(strength.checks).map(([key, passed]) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        {passed ? (
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        ) : (
                          <XCircle className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span className={passed ? 'text-green-600' : 'text-muted-foreground'}>
                          {key === 'length' && '8+ characters'}
                          {key === 'uppercase' && 'Uppercase letter'}
                          {key === 'lowercase' && 'Lowercase letter'}
                          {key === 'number' && 'Number'}
                          {key === 'special' && 'Special character'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Resetting password...' : 'Reset password'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="text-sm text-primary hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
