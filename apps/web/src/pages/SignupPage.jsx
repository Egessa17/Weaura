
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const SignupPage = () => {
  const { signup, login } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData.email, formData.password, formData.passwordConfirm, formData.name);
      await login(formData.email, formData.password);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - Weaura</title>
        <meta name="description" content="Create your Weaura account to start shopping premium fashion and accessories." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-2xl">W</span>
                </div>
                <span className="text-3xl font-bold">Weaura</span>
              </Link>
              <h1 className="text-3xl font-bold mb-2">Create your account</h1>
              <p className="text-muted-foreground">
                Join us to start shopping
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Maya Chen"
                    className="pl-10 bg-background text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="pl-10 bg-background text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="pl-10 bg-background text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="passwordConfirm"
                    type="password"
                    value={formData.passwordConfirm}
                    onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                    placeholder="••••••••"
                    className="pl-10 bg-background text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
