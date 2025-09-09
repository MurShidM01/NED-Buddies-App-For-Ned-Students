
"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, MessageSquare } from "lucide-react";
import { collection, onSnapshot, query, where, getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { type Conversation as ConversationType, User } from "@/lib/data";
import { ConversationList } from "@/components/conversation-list";
import { ChatView } from "@/components/chat-view";
import { UserListDialog } from "@/components/user-list-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { checkNotificationStatus, testNotificationRegistration } from "@/lib/firebase-messaging";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [error, setError] = useState("");
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (!authUser) return;

    setLoadingConversations(true);
    const q = query(collection(db, "conversations"), where("participants", "array-contains", authUser.uid));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const convsPromises = querySnapshot.docs.map(async (docSnap) => {
        try {
          const convData = docSnap.data();
          const otherParticipantId = convData.participants.find((p: string) => p !== authUser.uid) || authUser.uid;
          
          const userDoc = await getDoc(doc(db, "users", otherParticipantId));
          if (!userDoc.exists()) return null;

          const userData = userDoc.data();
          const user: User = {
              id: userDoc.id,
              fullName: userData.fullName || '',
              avatar: userData.avatarUrl,
              online: Math.random() > 0.5, // Simulate
              department: userData.department,
              semester: userData.semester,
              accountType: userData.accountType,
              gender: userData.gender,
          };
          
          if (user.id === authUser.uid) {
              user.fullName = `${user.fullName} (You)`;
              user.online = true;
          }

          return {
              id: docSnap.id,
              user: user,
              messages: [], // Messages will be fetched in ChatView
              unreadCount: 0, // Unread count logic to be implemented
              lastMessageTimestamp: convData.lastMessageTimestamp?.toDate()
          } as ConversationType;
        } catch (err) {
          console.error("Error processing conversation:", err);
          return null; // Skip faulty conversation
        }
      });

      const convs = (await Promise.all(convsPromises))
        .filter((c): c is ConversationType => c !== null)
        .sort((a, b) => (b.lastMessageTimestamp?.getTime() || 0) - (a.lastMessageTimestamp?.getTime() || 0));

      setConversations(convs);
      setLoadingConversations(false);
    }, (err) => {
        console.error("Error listening to conversations:", err);
        setError("Could not load your conversations. Please refresh the page.");
        setLoadingConversations(false);
    });

    return () => unsubscribe();
  }, [authUser]);


  const handleConversationSelect = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
  };
  
  const getConversationId = (uid1: string, uid2: string) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  }

  const handleStartConversation = useCallback(async (userToChat: User) => {
    if (!authUser) return;

    const convId = getConversationId(authUser.uid, userToChat.id);
    const convRef = doc(db, "conversations", convId);
    
    try {
        const convDoc = await getDoc(convRef);

        if (!convDoc.exists()) {
            await setDoc(convRef, {
                participants: [authUser.uid, userToChat.id].filter((id, index, self) => self.indexOf(id) === index), // Handle self-chat
                createdAt: serverTimestamp(),
                lastMessage: null,
                lastMessageTimestamp: serverTimestamp(),
            });
        }
        
        const userToChatForConv = {
            ...userToChat,
            fullName: userToChat.id === authUser.uid ? `${userToChat.fullName} (You)` : userToChat.fullName
        };

        const newOrExistingConv: ConversationType = {
            id: convId,
            user: userToChatForConv,
            messages: [],
            unreadCount: 0,
        };
        
        setSelectedConversation(newOrExistingConv);
        setIsUserListOpen(false);

    } catch (err: any) {
        console.error("Error starting conversation:", err);
        setError("Failed to start a new conversation. Please try again.");
    }
  }, [authUser]);


  const handleBack = () => {
    setSelectedConversation(null);
  };

  // Debug function for notifications
  const handleNotificationDebug = async () => {
    if (!authUser) return;
    
    console.log('=== NOTIFICATION DEBUG ===');
    console.log('User ID:', authUser.uid);
    
    // Check notification status
    const status = await checkNotificationStatus();
    console.log('Notification status:', status);
    
    // Test notification registration
    await testNotificationRegistration(authUser.uid);
    
    console.log('=== END DEBUG ===');
  };

  if (loadingConversations) {
     return (
      <div className="h-screen w-full flex bg-card overflow-hidden">
        <div className="w-full md:w-[350px] lg:w-[400px] flex flex-col border-r">
          <div className="flex items-center justify-between p-3 border-b bg-secondary">
             <Skeleton className="h-10 w-10 rounded-full" />
             <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
             </div>
          </div>
          <div className="p-3">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1 px-2 space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
         <div className="flex-1 flex-col hidden md:flex items-center justify-center gap-4 bg-background">
            <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen w-full flex bg-card overflow-hidden">
        <div className={cn(
            "w-full md:w-[350px] lg:w-[400px] flex flex-col border-r relative",
            selectedConversation && "hidden md:flex"
        )}>
          <ConversationList 
            conversations={conversations}
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
          />
          <Button 
              onClick={() => setIsUserListOpen(true)}
              className="absolute bottom-6 right-6 h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
          >
              <Plus className="h-8 w-8 text-primary-foreground" />
          </Button>
        </div>
        <div className={cn("flex-1 flex-col", selectedConversation ? "flex" : "hidden md:flex")}>
          {selectedConversation ? (
            <ChatView key={selectedConversation.id} conversation={selectedConversation} onBack={handleBack} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 bg-background">
              <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
              <div className="text-center">
                  <h2 className="text-xl font-medium text-muted-foreground">Select a Conversation</h2>
                  <p className="text-muted-foreground">Choose a chat from the left to start messaging.</p>
              </div>
              {/* Debug buttons for notifications */}
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={handleNotificationDebug}
                  variant="outline"
                  size="sm"
                >
                  Debug Notifications
                </Button>
                <Button 
                  onClick={() => window.location.href = '/debug'}
                  variant="outline"
                  size="sm"
                >
                  Advanced Debug
                </Button>
              </div>
            </div>
          )}
        </div>
         <UserListDialog open={isUserListOpen} onOpenChange={setIsUserListOpen} onStartConversation={handleStartConversation} />
      </div>
      <AlertDialog open={!!error} onOpenChange={() => setError("")}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>An Error Occurred</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError("")}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
