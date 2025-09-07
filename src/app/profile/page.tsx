
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Save, Loader2 } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type UserProfile = {
  uid: string;
  fullName: string;
  department: string;
  semester: string;
  email: string;
  avatarUrl?: string;
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const { user: authUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authUser) {
        try {
          const userDocRef = doc(db, 'users', authUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile({
              uid: authUser.uid,
              fullName: data.fullName,
              department: data.department,
              semester: data.semester,
              email: data.email,
              avatarUrl: data.avatarUrl,
            });
          } else {
            toast({ title: "Error", description: "User profile not found.", variant: "destructive" });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast({ title: "Error", description: "Failed to fetch user profile.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [authUser, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (userProfile) {
      setUserProfile({ ...userProfile, [id]: value });
    }
  };

  const handleSaveChanges = async () => {
    if (!userProfile || !authUser) return;
    setIsSaving(true);

    try {
      const dataToUpdate: any = {
        fullName: userProfile.fullName,
        department: userProfile.department,
        semester: userProfile.semester,
      };

      const userDocRef = doc(db, 'users', authUser.uid);
      await updateDoc(userDocRef, dataToUpdate);
      
      toast({ title: "Success", description: "Profile updated successfully!" });
      setIsEditing(false);

    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEditing = () => {
    if (isEditing) {
      handleSaveChanges();
    } else {
      setIsEditing(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-start justify-center bg-background p-4 pt-12 md:pt-20">
         <Card className="w-full max-w-md">
            <CardHeader className="items-center text-center pt-12">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="h-8 w-48 mt-4" />
              <Skeleton className="h-6 w-32 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-background p-4 pt-12 md:pt-20">
      <Card className="w-full max-w-md relative">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/chat">
              <ArrowLeft />
            </Link>
          </Button>
        </div>
        <CardHeader className="items-center text-center pt-12">
          <div className="relative">
            <Avatar className="w-24 h-24 border-2 border-primary">
              <AvatarImage src={userProfile?.avatarUrl} alt={userProfile?.fullName} data-ai-hint="person portrait" />
              <AvatarFallback>{userProfile?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="pt-4 text-3xl">{userProfile?.fullName}</CardTitle>
          <CardDescription>
            {userProfile?.department} - {userProfile?.semester} Semester
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={userProfile?.fullName || ''} onChange={handleInputChange} readOnly={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={userProfile?.email || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={userProfile?.department || ''} onChange={handleInputChange} readOnly={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Input id="semester" value={userProfile?.semester || ''} onChange={handleInputChange} readOnly={!isEditing} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={toggleEditing} className="w-full" disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : (
              isEditing ? <><Save className="mr-2" /> Save Changes</> : <><Edit className="mr-2" /> Edit Profile</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
