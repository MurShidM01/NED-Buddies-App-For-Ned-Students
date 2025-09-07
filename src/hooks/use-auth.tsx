
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const CURRENT_VERSION = "1.0.0"; // Make sure this is updated with each release

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateRequired, setUpdateRequired] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkForUpdates = async () => {
      const lastCheck = localStorage.getItem('lastUpdateCheck');
      const now = new Date().getTime();
      // Check every 12 hours (12 * 60 * 60 * 1000 ms)
      const twelveHours = 12 * 60 * 60 * 1000; 

      if (lastCheck && (now - parseInt(lastCheck, 10)) < twelveHours) {
        return; // Not time to check yet
      }

      try {
        const res = await fetch('https://api.github.com/repos/MurShidM01/NED-Buddies-App-For-Ned-Students/releases/latest');
        if (res.ok) {
            const latestRelease = await res.json();
            const latestVersion = latestRelease.tag_name.replace('v', '');
            
            // Simple version comparison
            if (latestVersion > CURRENT_VERSION) {
                setUpdateRequired(true);
            }
        }
      } catch (error) {
        console.error("Failed to check for updates:", error);
      } finally {
        localStorage.setItem('lastUpdateCheck', now.toString());
      }
    };
    checkForUpdates();
  }, []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && !currentUser.emailVerified) {
        setUser(null);
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname);
    const isSplashPage = pathname === '/';
    
    // If user is not logged in and not on an auth page or splash, redirect to login
    if (!user && !isAuthPage && !isSplashPage) {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
       <AlertDialog open={updateRequired}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Required</AlertDialogTitle>
            <AlertDialogDescription>
              A new version of NED Buddies is available. Please update the app to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => window.location.href = 'https://github.com/MurShidM01/NED-Buddies-App-For-Ned-Students/releases/latest'}>
                Update Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
