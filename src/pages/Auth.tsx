import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import nanoassistLogo from '@/assets/nanoassist-logo.jpg';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100, { message: "Password must be less than 100 characters" })
});

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = authSchema.parse({ email, password });

      // Ensure hardcoded admin exists and is confirmed
      const isHardcodedAdmin =
        validatedData.email === 'teofiltopciu123@gmail.com' &&
        (validatedData.password === 'iamadminnanoassist2025' ||
          validatedData.password === 'iamadmin2005nanoassist');

      if (isHardcodedAdmin) {
        try {
          await fetch('https://yahaotcqsjlotlqpfuuj.supabase.co/functions/v1/ensure-admin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaGFvdGNxc2psb3RscXBmdXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzUxOTAsImV4cCI6MjA1NzAxMTE5MH0.ycR8JfhX71Q1B16UM03VJ769hyXNQQb5CeA8HKhYPkY',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaGFvdGNxc2psb3RscXBmdXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzUxOTAsImV4cCI6MjA1NzAxMTE5MH0.ycR8JfhX71Q1B16UM03VJ769hyXNQQb5CeA8HKhYPkY',
            },
            body: JSON.stringify({ email: validatedData.email, password: validatedData.password }),
          });
        } catch (err) {
          // Non-blocking: proceed to sign-in regardless
        }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Login failed',
            description: 'Invalid email or password. Please try again.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Login failed',
            description: error.message,
            variant: 'destructive',
          });
        }
        return;
      }

      toast({ title: 'Welcome back!', description: 'You have successfully signed in.' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: 'Validation error', description: error.errors[0].message, variant: 'destructive' });
      } else {
        toast({ title: 'Login failed', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-white p-3 shadow-lg">
            <img src={nanoassistLogo} alt="NanoAssist logo" className="h-12 w-12 object-contain" />
          </div>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Bun venit</CardTitle>
            <CardDescription className="text-center">
              Conectează-te la contul tău
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}