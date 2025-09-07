
"use client"

import { Info, MessageSquareText, Search, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

import { Input } from "./ui/input";
import { Conversation } from "@/lib/data";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "./ui/skeleton";
import { ConversationItem } from "./conversation-item";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type ConversationListProps = {
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    onConversationSelect: (conversation: Conversation) => void;
}

export function ConversationList({ conversations, selectedConversation, onConversationSelect }: ConversationListProps) {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<{avatarUrl?: string, fullName?: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (authUser) {
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data());
        }
      }
      setLoading(false);
    }
    fetchUser();
  }, [authUser]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };
  
  const handleDeleteConversation = async () => {
    if (conversationToDelete) {
      await deleteDoc(doc(db, "conversations", conversationToDelete.id));
      setConversationToDelete(null);
    }
  };


  return (
    <>
      <div className="flex h-full flex-col bg-card text-foreground">
          <header className="flex items-center justify-between p-3 border-b bg-secondary">
            {loading ? <Skeleton className="h-10 w-10 rounded-full" /> : (
              <Link href="/profile">
                <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.fullName} data-ai-hint="person portrait"/>
                    <AvatarFallback>{currentUser?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Link>
            )}
            <div className="flex items-center gap-1">
               <Link href="/info" passHref>
                <Button variant="ghost" size="icon">
                  <Info />
                </Button>
              </Link>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <MoreVertical />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                          <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="/info">App Info</Link>
                    </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="p-3">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Search or start new chat" className="pl-10 bg-secondary focus:bg-card" />
              </div>
          </div>
          <ScrollArea className="flex-1">
              <div className="space-y-1 px-2">
              {conversations.length > 0 ? (
                  conversations.map((conv) => (
                      <ConversationItem
                          key={conv.id}
                          conversation={conv}
                          isSelected={selectedConversation?.id === conv.id}
                          onSelect={() => onConversationSelect(conv)}
                          onDelete={() => setConversationToDelete(conv)}
                      />
                  ))
              ) : (
                  <div className="text-center text-muted-foreground py-12 px-4">
                      <MessageSquareText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium">No Conversations Yet</h3>
                      <p className="mt-1 text-sm">Click the '+' button to find buddies.</p>
                  </div>
              )}
              </div>
          </ScrollArea>
      </div>

      <AlertDialog open={!!conversationToDelete} onOpenChange={(open) => !open && setConversationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this chat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConversation} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
