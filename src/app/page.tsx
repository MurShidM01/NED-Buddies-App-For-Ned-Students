"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function SplashPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.push('/chat');
    } else {
      router.push('/login');
    }
  }, [user, loading, router]);


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="relative flex items-center justify-center h-24 w-24">
          <MessageCircle className="h-24 w-24 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline">
          NED Buddies
        </h1>
        <p className="text-lg text-muted-foreground">Connecting NEDians, one chat at a time.</p>
        <Loader2 className="h-8 w-8 animate-spin text-primary mt-4" />
      </div>
    </main>
  );
}
