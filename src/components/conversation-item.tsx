
"use client"

import { useState, useRef } from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Conversation } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function ConversationItem({ conversation: conv, isSelected, onSelect, onDelete }: ConversationItemProps) {
  const [dragX, setDragX] = useState(0);
  const dragConstraints = { left: -80, right: 0 };

  return (
    <div className="relative w-full overflow-hidden bg-card rounded-lg">
      <motion.div
        drag="x"
        dragConstraints={dragConstraints}
        onDragEnd={(event, info) => {
            if (info.offset.x < -40) { // If dragged more than half of the delete button width
                setDragX(dragConstraints.left);
            } else {
                setDragX(0);
            }
        }}
        animate={{ x: dragX }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ x: dragX }}
        className="w-full"
      >
        <button
            onClick={onSelect}
            className={cn(
                "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-secondary bg-card",
                isSelected && "bg-secondary"
            )}
        >
            <div className="relative">
                <Avatar className="h-12 w-12 border">
                    <AvatarImage src={conv.user.avatar} alt={conv.user.fullName} data-ai-hint="person portrait"/>
                    <AvatarFallback>{conv.user.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
                {conv.user.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-blue-500 border-2 border-background" />
                )}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">{conv.user.fullName}</p>
                    <span className="text-xs text-muted-foreground">{conv.messages.at(-1)?.timestamp}</span>
                </div>
                <div className="flex justify-between items-start">
                    <p className="text-sm text-muted-foreground truncate">{conv.messages.at(-1)?.text}</p>
                    {conv.unreadCount > 0 && (
                        <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                            {conv.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
      </motion.div>
      <div className="absolute top-0 right-0 h-full w-20 flex items-center justify-center">
        <Button 
            variant="destructive" 
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={() => {
                onDelete();
                setDragX(0); // Reset position after click
            }}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
