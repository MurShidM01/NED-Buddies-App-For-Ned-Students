
"use client";

import { useState, useEffect } from "react";
import { Plus, MessageSquare } from "lucide-react";
import { collection, onSnapshot, query, where, getDocs, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';

import { type Conversation as ConversationType, User } from "@/lib/data";
import { ConversationList } from "@/components/conversation-list";
import { ChatView } from "@/components/chat-view";
import { UserListDialog } from "@/components/user-list-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (!authUser) return;

    setLoadingConversations(true);
    const q = query(collection(db, "conversations"), where("participants", "array-contains", authUser.uid));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const convs: ConversationType[] = [];
      for (const docSnap of querySnapshot.docs) {
        const convData = docSnap.data();
        const otherParticipantId = convData.participants.find((p: string) => p !== authUser.uid);
        
        let user: User | null = null;
        if(otherParticipantId) {
            const userDoc = await getDoc(doc(db, "users", otherParticipantId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                user = {
                    id: userDoc.id,
                    fullName: userData.fullName || '',
                    avatar: userData.avatarUrl,
                    online: Math.random() > 0.5, // Simulate
                    department: userData.department,
                    semester: userData.semester,
                    accountType: userData.accountType,
                    gender: userData.gender,
                };
            }
        } else {
            // This is a self-chat
            const userDoc = await getDoc(doc(db, "users", authUser.uid));
             if (userDoc.exists()) {
                const userData = userDoc.data();
                user = {
                    id: userDoc.id,
                    fullName: `${userData.fullName} (You)`, // Use user's name for self-chat
                    avatar: userData.avatarUrl,
                    online: true,
                    department: userData.department,
                    semester: userData.semester,
                    accountType: userData.accountType,
                    gender: userData.gender,
                };
            }
        }

        if(user) {
            convs.push({
                id: docSnap.id,
                user: user,
                messages: [], // Messages will be fetched in ChatView
                unreadCount: 0, // Unread count logic to be implemented
            });
        }
      }
      setConversations(convs.sort((a, b) => (a.user.fullName > b.user.fullName) ? 1 : -1));
      setLoadingConversations(false);
    });

    return () => unsubscribe();
  }, [authUser]);


  const handleConversationSelect = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
  };
  
  const handleStartConversation = async (userToChat: User) => {
    if (!authUser) return;

    // Check if conversation already exists
    const q = query(collection(db, "conversations"), 
        where("participants", "array-contains", authUser.uid)
    );
    const querySnapshot = await getDocs(q);
    let existingConv: ConversationType | null = null;

    const userToChatForConv = {
        ...userToChat,
        fullName: userToChat.id === authUser.uid ? `${userToChat.fullName} (You)` : userToChat.fullName
    }
    
    querySnapshot.forEach(doc => {
        const participants = doc.data().participants;
        if (participants.includes(userToChat.id)) {
            // For self-chat, ensure it's the only participant
            if (userToChat.id === authUser.uid && participants.length === 1) {
                 existingConv = { id: doc.id, user: userToChatForConv, messages: [], unreadCount: 0 };
            // For two-person chat, ensure both are present
            } else if (userToChat.id !== authUser.uid && participants.length === 2) {
                 existingConv = { id: doc.id, user: userToChatForConv, messages: [], unreadCount: 0 };
            }
        }
    });

    if (existingConv) {
        setSelectedConversation(existingConv);
        setIsUserListOpen(false);
    } else {
        // Create new conversation
        const participants = userToChat.id === authUser.uid ? [authUser.uid] : [authUser.uid, userToChat.id];
        const newConvRef = await addDoc(collection(db, "conversations"), {
            participants,
            createdAt: serverTimestamp(),
            lastMessage: null,
        });
        const newConv: ConversationType = {
            id: newConvRef.id,
            user: userToChatForConv,
            messages: [],
            unreadCount: 0,
        };
        setSelectedConversation(newConv);
        setIsUserListOpen(false);
    }
  }


  const handleBack = () => {
    setSelectedConversation(null);
  };

  if (loadingConversations) {
     return (
      <div className="h-screen w-full flex bg-card overflow-hidden">
        <div className="w-full md:w-[350px] lg:w-[400px] flex flex-col border-r">
          <div className="flex items-center justify-between p-3 border-b bg-secondary">
             <Skeleton className="h-10 w-10 rounded-full" />
             <div className="flex gap-2">
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
          </div>
        )}
      </div>
       <UserListDialog open={isUserListOpen} onOpenChange={setIsUserListOpen} onStartConversation={handleStartConversation} />
    </div>
  );
}
