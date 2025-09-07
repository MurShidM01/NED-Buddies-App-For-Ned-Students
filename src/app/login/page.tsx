"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Logo } from '@/components/logo';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/chat');
    }
  }, [user, loading, router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        toast({
          title: "Email Not Verified",
          description: "A new verification email has been sent. Please verify your email before logging in.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      // The useEffect will handle the redirect
    } catch (error: any) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            setError("The email address you entered isn't connected to an account. Please check your email or sign up for a new account.");
        } else {
            setError(error.message || "An unexpected error occurred.");
        }
    } finally {
        setIsLoading(false);
    }
  };

  if (loading || user) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center">
          <Logo />
          <CardTitle className="pt-4">Welcome Back!</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">University Email</Label>
              <Input id="email" name="email" type="email" placeholder="user@cloud.neduet.edu.pk" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button form="login-form" type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      <AlertDialog open={!!error} onOpenChange={() => setError("")}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Failed</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError("")}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}