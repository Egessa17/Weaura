
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const OTPVerificationPage = () => {
  const { authWithOTP, requestOTP, otpId } = useAuthContext();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (code.length !== 8) {
      setError('Please enter the complete 8-digit code');
      return;
    }

    setIsVerifying(true);

    try {
      await authWithOTP(otpId, code);
      toast.success('Verification successful');
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsResending(true);
    setError('');

    try {
      await requestOTP(email);
      toast.success('New code sent to your email');
    } catch (err) {
      setError('Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify OTP - OnlineShop</title>
        <meta name="description" content="Enter your verification code to complete login." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-muted px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Verify your email</h1>
              <p className="text-muted-foreground">
                Enter the 8-digit code sent to your email
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <Label htmlFor="email">Email (for resending)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="00000000"
                  maxLength={8}
                  className="mt-2 text-center text-2xl tracking-widest bg-background text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isVerifying || code.length !== 8}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-sm text-primary hover:underline"
                >
                  {isResending ? 'Resending...' : 'Resend code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPVerificationPage;
