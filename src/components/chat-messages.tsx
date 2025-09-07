
"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { type Message } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { Check, CheckCheck, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { deleteDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

type ChatMessagesProps = {
  messages: Message[];
  conversationId: string;
};

export function ChatMessages({ messages, conversationId }: ChatMessagesProps) {
  const { user: authUser } = useAuth();
  const loggedInUserId = authUser?.uid;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = (message: Message) => {
    longPressTimeout.current = setTimeout(() => {
      setSelectedMessage(message);
      setDialogOpen(true);
    }, 500); // 500ms for long press
  };

  const handleMouseUp = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };
  
  const handleDeleteForMe = async () => {
    if (!selectedMessage || !loggedInUserId) return;
    const messageRef = doc(db, "conversations", conversationId, "messages", selectedMessage.id);
    await updateDoc(messageRef, {
        deletedFor: arrayUnion(loggedInUserId)
    });
    setDialogOpen(false);
    setSelectedMessage(null);
  };

  const handleDeleteForEveryone = async () => {
     if (!selectedMessage) return;
     const messageRef = doc(db, "conversations", conversationId, "messages", selectedMessage.id);
     await deleteDoc(messageRef);
     setDialogOpen(false);
     setSelectedMessage(null);
  };


  const MessageStatus = ({ status }: { status: 'sent' | 'read' }) => {
    if (status === 'read') {
      return <CheckCheck className="h-4 w-4 text-blue-500" />;
    }
    if (status === 'sent') {
      return <Check className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
        <div className="flex flex-col gap-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2",
                message.senderId === loggedInUserId ? "justify-end" : "justify-start"
              )}
              onMouseDown={() => handleMouseDown(message)}
              onMouseUp={handleMouseUp}
              onTouchStart={() => handleMouseDown(message)}
              onTouchEnd={handleMouseUp}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-lg p-2 px-3 text-sm shadow-md cursor-pointer",
                  message.senderId === loggedInUserId
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                )}
              >
                {message.text && <p className="text-base break-words">{message.text}</p>}
                <div className={cn("flex items-center gap-2 justify-end text-xs mt-1", message.senderId === loggedInUserId ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  <span>{message.timestamp}</span>
                  {message.senderId === loggedInUserId && (
                    <MessageStatus status={message.status} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete Message</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to delete this message? This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-start">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <AlertDialogAction onClick={handleDeleteForEveryone} className="w-full bg-destructive hover:bg-destructive/80">
                         <Trash2 className="mr-2"/> Delete for everyone
                    </AlertDialogAction>
                    <AlertDialogAction onClick={handleDeleteForMe} className="w-full">
                        Delete for me
                    </AlertDialogAction>
                    <AlertDialogCancel className="w-full mt-0">Cancel</AlertDialogCancel>
                </div>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
