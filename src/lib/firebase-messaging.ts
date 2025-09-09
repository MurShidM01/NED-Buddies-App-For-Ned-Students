
"use client";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { app, db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

const VAPID_KEY = "BCMAJKRLsT79bd4evx7pElkBazH2fb_s9Ce90ZNuFxMnve9dBlTH-AVuBLlc4IQWXZCjkbU2J7h-RjL9es0BRy8";

// Unified function to register for both native and web push notifications
export const registerForPushNotifications = async (userId: string) => {
    try {
        if (Capacitor.isNativePlatform()) {
            await registerNativePush(userId);
        } else {
            await registerWebPush(userId);
        }
    } catch (err) {
        console.error("Push notification registration failed", err);
    }
};


// ----- NATIVE (CAPACITOR) PUSH NOTIFICATIONS -----

const registerNativePush = async (userId: string) => {
    console.log('Starting native push registration...');
    
    // Request permission to send notifications
    let permStatus = await PushNotifications.requestPermissions();
    console.log('Permission status:', permStatus);
    
    // If permission is not granted, throw an error.
    if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
    }

    // Now, register for push notifications
    await PushNotifications.register();
    console.log('Push notifications registered');

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', async (token) => {
        console.log('Push registration success, token: ' + token.value);
        await saveMessagingDeviceToken(userId, token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration: ' + JSON.stringify(error));
        throw new Error('Push registration error');
    });

    // Listen for notifications when app is in foreground
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received in foreground:', notification);
        // You can show a custom notification here
    });

    // Listen for notification taps
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification);
    });
}


// ----- WEB (FIREBASE MESSAGING) PUSH NOTIFICATIONS -----

const registerWebPush = async (userId: string) => {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    console.log("This browser does not support desktop notification");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted.");
    await getAndSaveWebPushToken(userId);
  } else {
    throw new Error("Unable to get permission to notify.");
  }
};

export const getAndSaveWebPushToken = async (userId: string) => {
  try {
    const messaging = getMessaging(app);
    const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    
    if (fcmToken) {
        await saveMessagingDeviceToken(userId, fcmToken);
    } else {
      console.log("No registration token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
  }
};


// ----- SHARED LOGIC -----

const saveMessagingDeviceToken = async (userId: string, token: string) => {
    try {
        console.log("Saving push token for user:", userId);
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
            fcmToken: token,
        });
        console.log("Push token saved successfully.");
    } catch (error) {
        console.error("Error saving push token:", error);
    }
}


export const onMessageListener = () =>
  new Promise((resolve) => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && !Capacitor.isNativePlatform()) {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
            console.log('Foreground message received.', payload);
            resolve(payload);
        });
    }
    
    // For native, we can listen for the notification as well
    if(Capacitor.isNativePlatform()){
         PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push received: ', notification);
            resolve({
                notification: {
                    title: notification.title,
                    body: notification.body
                }
            });
        });
    }
});

// Function to check notification permissions and status
export const checkNotificationStatus = async () => {
    if (Capacitor.isNativePlatform()) {
        const permStatus = await PushNotifications.checkPermissions();
        console.log('Current notification permissions:', permStatus);
        return permStatus;
    } else {
        if ('Notification' in window) {
            console.log('Web notification permission:', Notification.permission);
            return { receive: Notification.permission };
        }
    }
    return { receive: 'denied' };
};

// Function to manually trigger notification registration (for testing)
export const testNotificationRegistration = async (userId: string) => {
    console.log('Testing notification registration...');
    try {
        await registerForPushNotifications(userId);
        console.log('Notification registration test completed');
    } catch (error) {
        console.error('Notification registration test failed:', error);
    }
};
