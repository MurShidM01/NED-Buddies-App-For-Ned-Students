
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useAuth } from "@/hooks/use-auth";

type MessageInputProps = {
    conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { user: authUser } = useAuth();

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
    textareaRef.current?.focus();
  };

  const handleSendMessage = async (text: string) => {
    if (!authUser || !text.trim()) return;
    
    const messagesCollection = collection(db, "conversations", conversationId, "messages");
    
    const messageData: any = {
        senderId: authUser.uid,
        text: text,
        timestamp: serverTimestamp(),
        status: 'sent',
    };

    await addDoc(messagesCollection, messageData);
    
    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp(),
    });

    setMessage("");
    setEmojiPickerOpen(false);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(message);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);


  return (
    <div className="border-t bg-secondary p-2">
      <div
        className="flex items-end gap-2"
      >
        <Popover open={isEmojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
            <PopoverTrigger asChild>
                <Button type="button" size="icon" variant="ghost" className="self-end">
                    <Smile className="h-6 w-6" />
                    <span className="sr-only">Emoji</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-0 mb-2">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </PopoverContent>
        </Popover>

        <Textarea
          ref={textareaRef}
          placeholder="Type a message"
          className="flex-1 resize-none rounded-xl bg-background px-4 py-2.5 max-h-40 min-h-11 overflow-y-auto"
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="submit" size="icon" className="rounded-full bg-primary h-11 w-11 self-end" disabled={!message.trim()} onClick={() => handleSendMessage(message)}>
          <Send className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}

