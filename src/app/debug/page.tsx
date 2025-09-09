"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { checkNotificationStatus, testNotificationRegistration } from '@/lib/firebase-messaging';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

export default function DebugPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const checkPermissions = async () => {
    addLog('🔍 Checking notification permissions...');
    try {
      const status = await checkNotificationStatus();
      addLog(`📱 Permission status: ${JSON.stringify(status)}`);
    } catch (error) {
      addLog(`❌ Error checking permissions: ${error}`);
    }
  };

  const testRegistration = async () => {
    if (!user) {
      addLog('❌ No user logged in');
      return;
    }

    addLog('🧪 Testing notification registration...');
    setIsLoading(true);
    
    try {
      await testNotificationRegistration(user.uid);
      addLog('✅ Registration test completed');
    } catch (error) {
      addLog(`❌ Registration test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentToken = async () => {
    if (!Capacitor.isNativePlatform()) {
      addLog('❌ This function only works on native platforms');
      return;
    }

    addLog('🔑 Getting current FCM token...');
    try {
      const result = await PushNotifications.checkPermissions();
      addLog(`📱 Current permissions: ${JSON.stringify(result)}`);
      
      // Try to get the token
      PushNotifications.addListener('registration', (token) => {
        addLog(`🎯 FCM Token: ${token.value}`);
      });

      PushNotifications.addListener('registrationError', (error) => {
        addLog(`❌ Registration error: ${JSON.stringify(error)}`);
      });

      // Request permissions and register
      const permStatus = await PushNotifications.requestPermissions();
      if (permStatus.receive === 'granted') {
        await PushNotifications.register();
        addLog('✅ Push notifications registered');
      } else {
        addLog('❌ Permission denied');
      }
    } catch (error) {
      addLog(`❌ Error getting token: ${error}`);
    }
  };

  const testNotificationListeners = () => {
    if (!Capacitor.isNativePlatform()) {
      addLog('❌ This function only works on native platforms');
      return;
    }

    addLog('👂 Setting up notification listeners...');
    
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      addLog(`📨 Notification received: ${JSON.stringify(notification)}`);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      addLog(`👆 Notification tapped: ${JSON.stringify(notification)}`);
    });

    addLog('✅ Notification listeners set up');
  };

  useEffect(() => {
    addLog('🚀 Debug page loaded');
    addLog(`📱 Platform: ${Capacitor.isNativePlatform() ? 'Native' : 'Web'}`);
    addLog(`👤 User: ${user ? user.uid : 'Not logged in'}`);
  }, [user]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Notification Debug Tool</CardTitle>
          <CardDescription>
            Debug FCM notifications and check app status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={checkPermissions} variant="outline">
              Check Permissions
            </Button>
            <Button onClick={testRegistration} disabled={isLoading}>
              {isLoading ? 'Testing...' : 'Test Registration'}
            </Button>
            <Button onClick={getCurrentToken} variant="outline">
              Get FCM Token
            </Button>
            <Button onClick={testNotificationListeners} variant="outline">
              Setup Listeners
            </Button>
            <Button onClick={clearLogs} variant="destructive" className="col-span-2">
              Clear Logs
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">📋 Debug Logs</h3>
            <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Click a button above to start debugging.</p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
