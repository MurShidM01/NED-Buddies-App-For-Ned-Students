
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type User } from "@/lib/data";
import { Lock } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";

type UserProfileDialogProps = {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartChat: () => void;
};

export function UserProfileDialog({ user, open, onOpenChange, onStartChat }: UserProfileDialogProps) {
  const { user: authUser } = useAuth();
  if (!user) return null;

  const isPrivate = user.accountType === "Private";
  const isSelf = user.id === authUser?.uid;


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage
                src={user.avatar}
                alt={user.fullName}
                data-ai-hint="person portrait"
              />
              <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            {isPrivate && !isSelf && (
              <div className="absolute bottom-0 right-0 bg-secondary p-1 rounded-full border-2 border-background">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <DialogTitle className="text-2xl pt-2">{user.fullName}</DialogTitle>
          <DialogDescription>
            {isPrivate && !isSelf
              ? "This profile is private."
              : `${user.department} - ${user.semester} Semester`}
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 pt-0 text-center">
          {isPrivate && !isSelf ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground bg-muted/50 p-6 rounded-lg">
              <Lock className="h-10 w-10 mb-4" />
              <p className="font-semibold">This user has a private account.</p>
              <p className="text-sm">
                You cannot view their details or start a chat.
              </p>
            </div>
          ) : (
            <div className="flex justify-center pt-4">
              <Button onClick={onStartChat}>Start Chat</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
