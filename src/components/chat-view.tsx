
import { useState, useEffect, useRef } from "react";
import { collection, query, onSnapshot, orderBy, Timestamp, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Conversation, Message } from "@/lib/data";
import { ChatHeader } from "./chat-header";
import { MessageInput } from "./message-input";
import { ChatMessages } from "./chat-messages";
import { UserProfileDialog } from "./user-profile-dialog";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type ChatViewProps = {
  conversation: Conversation;
  onBack: () => void;
};

export function ChatView({ conversation, onBack }: ChatViewProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user: authUser } = useAuth();


  useEffect(() => {
    if (!authUser) return;
    
    setLoadingMessages(true);
    const messagesCollection = collection(db, "conversations", conversation.id, "messages");
    const q = query(messagesCollection, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const msgs = querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          senderId: data.senderId,
          text: data.text,
          timestamp: (data.timestamp as Timestamp)?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'sending...',
          status: data.status,
          deletedFor: data.deletedFor || [],
        } as Message;
      })
      .filter(msg => !msg.deletedFor?.includes(authUser.uid)); // Filter out messages deleted for the current user

      setMessages(msgs);
      setLoadingMessages(false);

      // Mark messages as read
      const isSelfChat = conversation.user.id === authUser.uid;
      const batch = writeBatch(db);
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.status !== 'read') {
            if (isSelfChat || data.senderId !== authUser.uid) {
                 batch.update(doc.ref, { status: 'read' });
            }
        }
      });
      await batch.commit().catch(err => console.error("Error marking messages as read:", err));
    }, (err) => {
        console.error("Error fetching messages:", err);
        // We can show an error toast/dialog here if needed
        setLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [conversation.id, authUser, conversation.user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full flex-col bg-background">
      <ChatHeader
        user={conversation.user}
        onBack={onBack}
        onShowProfile={() => setIsProfileOpen(true)}
      />
      {loadingMessages ? (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ChatMessages messages={messages} conversationId={conversation.id} />
      )}
      <div ref={messagesEndRef} />
      <MessageInput conversationId={conversation.id} />
      <UserProfileDialog
        user={conversation.user}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        onStartChat={() => {
            setIsProfileOpen(false);
        }}
      />
    </div>
  );
}
