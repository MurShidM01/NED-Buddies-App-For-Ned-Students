
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DEPARTMENTS, SEMESTERS } from '@/lib/constants';
import { Logo } from '@/components/logo';
import { auth, db } from '@/lib/firebase';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Type assertions for Firebase imports
const firebaseAuth = auth as Auth;
const firebaseDb = db as Firestore;
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  category: z.enum(['BE', 'BS', 'Others']),
  department: z.string().min(1, "Department is required."),
  semester: z.string().min(1, "Semester is required."),
  gender: z.enum(['Male', 'Female']),
  universityEmail: z.string().email().refine(email => email.endsWith('@cloud.neduet.edu.pk'), "Only NED University emails are allowed."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  accountType: z.enum(['Public', 'Private']),
});

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAwaitingVerification, setIsAwaitingVerification] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'timeout'>('pending');
  const router = useRouter();
  
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      category: undefined,
      department: "",
      semester: "",
      gender: undefined,
      universityEmail: "",
      password: "",
      accountType: 'Public',
    },
  });

  const category = form.watch('category');

  const departmentOptions = useMemo(() => {
    if (!category || category === 'Others') return [];
    return DEPARTMENTS[category] || [];
  }, [category]);

  useEffect(() => {
    form.setValue('department', '');
  }, [category, form]);

  // Function to update Firestore user status
  const updateUserFirestoreStatus = async (user: any) => {
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

  // Monitor authentication state after registration
  useEffect(() => {
    if (!isAwaitingVerification) return;

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        await user.reload();
        console.log('Auth state changed - User email verified:', user.emailVerified);
        if (user.emailVerified) {
          console.log('Email verified! Updating Firestore and redirecting...');
          setIsAwaitingVerification(false);
          setVerificationStatus('verified');
          await updateUserFirestoreStatus(user);
          // Close the dialog and redirect to chat
          setShowSuccessDialog(false);
          router.push('/chat');
        }
      }
    });

    // Set a timeout to show manual refresh option
    const timeout = setTimeout(() => {
      if (verificationStatus === 'pending') {
        setVerificationStatus('timeout');
      }
    }, 30000); // 30 seconds timeout

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [isAwaitingVerification, verificationStatus, router]);
  
  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    setError("");
    try {
      if (!auth) {
        setError("Firebase authentication is not properly configured. Please check your environment variables.");
        setIsLoading(false);
        return;
      }
      
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, values.universityEmail, values.password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(firebaseDb, "users", user.uid), {
        uid: user.uid,
        fullName: values.fullName,
        category: values.category,
        department: values.department,
        semester: values.semester,
        gender: values.gender,
        email: values.universityEmail,
        accountType: values.accountType,
        emailVerified: false, // Set verification status to false initially
      });

      // Start monitoring for email verification
      setIsAwaitingVerification(true);
      setVerificationStatus('pending');
      setShowSuccessDialog(true);
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email address is already in use by another account.");
      } else {
        setError(err.message || "An unexpected error occurred during sign up.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="items-center">
            <Logo />
            <CardTitle className="pt-4">Create an Account</CardTitle>
            <CardDescription>Join the NED community. It&apos;s free and only for students.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="BE">BE</SelectItem>
                        <SelectItem value="BS">BS</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    {(category as string) === 'Others' ? (
                      <FormControl><Input placeholder="Your department" {...field} /></FormControl>
                    ) : (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger disabled={!category || (category as string) === 'Others'}><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {departmentOptions.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="semester" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a semester" /></SelectTrigger></FormControl>
                      <SelectContent>{SEMESTERS.map(sem => <SelectItem key={sem} value={sem}>{sem}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="gender" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a gender" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="universityEmail" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>University Email</FormLabel>
                    <FormControl><Input placeholder="user@cloud.neduet.edu.pk" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Password</FormLabel>
                     <FormControl>
                        <div className="relative">
                           <Input type={showPassword ? "text" : "password"} {...field} />
                           <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                               {showPassword ? <EyeOff /> : <Eye />}
                           </button>
                        </div>
                     </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="accountType" render={({ field }) => (
                  <FormItem className="space-y-3 md:col-span-2">
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Public" /></FormControl>
                          <FormLabel className="font-normal">Public</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Private" /></FormControl>
                          <FormLabel className="font-normal">Private</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="md:col-span-2 pt-4">
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!error} onOpenChange={() => setError("")}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Signup Failed</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError("")}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccessDialog} onOpenChange={() => {
        if (verificationStatus === 'verified') {
          router.push('/chat');
        } else {
          router.push('/login');
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {verificationStatus === 'verified' ? 'Email Verified!' : 'Account Created'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {verificationStatus === 'verified' 
                ? 'Your email has been verified successfully! Redirecting to chat...'
                : verificationStatus === 'timeout'
                ? 'A verification email has been sent to your university email address. Please check your email and click the verification link. If you have already verified, click "Refresh" to check your status.'
                : 'A verification email has been sent to your university email address. Please verify your email before logging in. We are monitoring for verification...'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2">
            {verificationStatus === 'verified' ? (
              <AlertDialogAction onClick={() => router.push('/chat')}>
                Go to Chat
              </AlertDialogAction>
            ) : verificationStatus === 'timeout' ? (
              <>
                <AlertDialogAction onClick={() => window.location.reload()}>
                  Refresh Page
                </AlertDialogAction>
                <AlertDialogAction onClick={() => router.push('/login')}>
                  Go to Login
                </AlertDialogAction>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Waiting for email verification...
                </div>
                <AlertDialogAction onClick={() => router.push('/login')}>
                  Go to Login
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
