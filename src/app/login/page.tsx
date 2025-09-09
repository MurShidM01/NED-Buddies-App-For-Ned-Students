
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Logo } from '@/components/logo';
import { auth, db } from '@/lib/firebase';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Type assertions for Firebase imports
const firebaseAuth = auth as Auth;
const firebaseDb = db as Firestore;
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAwaitingVerification, setIsAwaitingVerification] = useState(false);
  const router = useRouter();
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    if (!isAwaitingVerification) return;

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setIsAwaitingVerification(false);
          await updateUserFirestoreStatus(user);
          router.push('/chat');
        }
      }
    });

    return () => unsubscribe();
  }, [isAwaitingVerification, router]);

  const updateUserFirestoreStatus = async (user: FirebaseAuthUser) => {
    console.log('Updating Firestore status for user:', user.uid);
    const userDocRef = doc(firebaseDb, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    console.log('User document exists:', userDoc.exists());
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('Current Firestore emailVerified status:', userData?.emailVerified);
      if (userData?.emailVerified !== true) {
        console.log('Updating Firestore emailVerified to true');
        await updateDoc(userDocRef, { emailVerified: true });
        console.log('Firestore update completed');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setIsAwaitingVerification(false);

    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    try {
      if (!auth) {
        setError("Firebase authentication is not properly configured. Please check your environment variables.");
        setIsLoading(false);
        return;
      }
      
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const authUser = userCredential.user;
      
      console.log('Login successful, user:', authUser.uid);
      await authUser.reload();
      console.log('User email verified after reload:', authUser.emailVerified);
      
      if (!authUser.emailVerified) {
        console.log('User not verified, sending verification email');
        await sendEmailVerification(authUser);
        setIsAwaitingVerification(true);
        setIsLoading(false);
        return;
      }
      
      console.log('User verified, updating Firestore and redirecting');
      await updateUserFirestoreStatus(authUser);
      router.push('/chat');

    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            setError("The email or password you entered is incorrect. Please check your credentials or sign up.");
        } else if (error.code === 'auth/wrong-password') {
             setError("Incorrect password. Please try again or use the 'Forgot password?' link.");
        } else {
            console.error("Login error:", error);
            setError(error.message || "An unexpected error occurred during login.");
        }
        setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  if (authLoading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <>
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
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} required />
                  <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button form="login-form" type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading || isAwaitingVerification}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Having trouble logging in after email verification?{' '}
              <button 
                onClick={() => window.location.reload()} 
                className="underline hover:text-foreground"
              >
                Refresh page
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
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

      <AlertDialog open={isAwaitingVerification}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Email Not Verified</AlertDialogTitle>
            <AlertDialogDescription>
              A new verification email has been sent. Please verify your email to continue. The app will automatically log you in once you're verified.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
