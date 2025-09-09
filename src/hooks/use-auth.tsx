
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { onMessageListener, registerForPushNotifications } from '@/lib/firebase-messaging';
import { useToast } from './use-toast';
import { isNewerVersion, CURRENT_VERSION } from '@/lib/version';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

const TWELVE_HOURS_IN_MS = 12 * 60 * 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateInfo, setUpdateInfo] = useState<{ available: boolean, url: string }>({ available: false, url: '' });
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth is not initialized');
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser ? 'User exists' : 'No user');
      if (currentUser) {
        await currentUser.reload();
        console.log('User email verified:', currentUser.emailVerified);
        if (currentUser.emailVerified) {
          console.log('Setting user in context');
          setUser(currentUser);
          registerForPushNotifications(currentUser.uid);
        } else {
          console.log('User not verified, setting user to null');
          setUser(null);
        }
      } else {
        console.log('No user, setting user to null');
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if(user) {
        onMessageListener()
        .then(payload => {
            if (payload && typeof payload === 'object' && 'notification' in payload && payload.notification) {
              const notification = payload.notification as { title?: string; body?: string };
              if (notification.title && notification.body) {
                toast({
                  title: notification.title,
                  description: notification.body
                });
              }
            }
        })
        .catch(err => console.log('failed to listen for foreground messages', err));
    }
  }, [user, toast]);
  
  useEffect(() => {
    const checkForUpdates = async () => {
      if (typeof window === 'undefined') return;

      try {
        const res = await fetch('https://api.github.com/repos/MurShidM01/NED-Buddies-App-For-Ned-Students/releases/latest');
        if (res.ok) {
            const latestRelease = await res.json();
            const latestVersion = latestRelease.tag_name.replace('v', '');

            if (isNewerVersion(CURRENT_VERSION, latestVersion)) {
                setUpdateInfo({ available: true, url: latestRelease.html_url });
            }
        }
      } catch (error) {
        console.error("Failed to check for updates:", error);
      }
    };
    
    checkForUpdates();
    const intervalId = setInterval(checkForUpdates, TWELVE_HOURS_IN_MS);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (loading) return; // Do nothing while loading

    const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname);
    
    // If user is logged in, redirect from auth pages to chat
    if (user && isAuthPage) {
      router.push('/chat');
    }
    
    // If user is not logged in, redirect from protected pages to login
    if (!user && !isAuthPage && pathname !== '/') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
       <AlertDialog open={updateInfo.available}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Available</AlertDialogTitle>
            <AlertDialogDescription>
              A new version of NED Buddies is available. Please update the app to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => window.location.href = updateInfo.url}>
                Update Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
