"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target as HTMLFormElement;
    const email = form.email.value;

    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error Sending Email",
        description: error.message || "Could not send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center">
          <Logo />
          <CardTitle className="pt-4">Forgot Password</CardTitle>
          <CardDescription>
            {submitted 
              ? "Check your inbox for the reset link."
              : "No worries! Enter your email to reset your password."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p>A password reset link has been sent to your email address.</p>
            </div>
          ) : (
            <form id="forgot-password-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">University Email</Label>
                <Input id="email" name="email" type="email" placeholder="user@cloud.neduet.edu.pk" required />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="link" className="w-full" asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
