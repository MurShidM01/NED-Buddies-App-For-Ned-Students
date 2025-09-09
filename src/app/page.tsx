
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Loader2, WifiOff, ServerCrash } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SplashPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState('Checking Connections...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runChecksAndNavigate = async () => {
      // 1. Check Internet Connection
      if (typeof window !== 'undefined' && !navigator.onLine) {
        setError("No internet connection. Please check your network and try again.");
        setStatus('Offline');
        return;
      }
      
      // 2. Check Firebase Connection
      setStatus('Connecting to Services...');
      try {
        await getDoc(doc(db, 'system', 'health_check'));
        setStatus('Ready!');
      } catch (err) {
        console.error("Firebase connection check failed:", err);
        setError("Could not connect to services. The service may be temporarily unavailable.");
        setStatus('Connection Failed');
        return;
      }

      // 3. Wait for auth state to be confirmed before navigating
      if (!authLoading) {
         if (user) {
          router.push('/chat');
        } else {
          router.push('/login');
        }
      }
    };
    
    const timer = setTimeout(runChecksAndNavigate, 1500);

    return () => clearTimeout(timer);
  }, [user, authLoading, router]);

  const renderStatus = () => {
    if (error) {
       return (
         <div className="flex flex-col items-center text-destructive">
           {status === 'Offline' ? <WifiOff className="h-8 w-8 mb-2" /> : <ServerCrash className="h-8 w-8 mb-2" />}
           <p className="font-semibold">{status}</p>
           <p className="text-sm text-center max-w-xs mt-1">{error}</p>
         </div>
       );
    }
    return (
       <div className="flex items-center text-primary">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            <p className="text-lg">{status}</p>
       </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="relative flex items-center justify-center h-24 w-24">
          <MessageCircle className="h-24 w-24 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline">
          NED Buddies
        </h1>
        <p className="text-lg text-muted-foreground">Connecting NEDians, one chat at a time.</p>
        <div className="pt-4 h-20">
           {renderStatus()}
        </div>
      </div>
    </main>
  );
}
