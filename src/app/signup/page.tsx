"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DEPARTMENTS, SEMESTERS } from '@/lib/constants';
import { Logo } from '@/components/logo';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

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
  const router = useRouter();
  const { toast } = useToast();
  
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
  
  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.universityEmail, values.password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: values.fullName,
        category: values.category,
        department: values.department,
        semester: values.semester,
        gender: values.gender,
        email: values.universityEmail,
        accountType: values.accountType,
      });

      toast({
        title: "Account Created",
        description: "A verification email has been sent. Please verify your email before logging in.",
      });

      router.push('/login');
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                  {category === 'Others' ? (
                    <FormControl><Input placeholder="Your department" {...field} /></FormControl>
                  ) : (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger disabled={!category || category === 'Others'}><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl>
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
                  <FormControl><Input type="password" {...field} /></FormControl>
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
  );
}
