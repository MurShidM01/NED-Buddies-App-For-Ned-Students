import { useState } from "react";
import { Send, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useAuth } from "@/hooks/use-auth";

type MessageInputProps = {
    conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const { user: authUser } = useAuth();

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
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
    
    // Also update the last message on the conversation for sorting/previews
    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp(),
    });

    setMessage("");
    setEmojiPickerOpen(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(message);
  };

  return (
    <div className="border-t bg-secondary p-2">
      <form
        className="flex items-center gap-2"
        onSubmit={handleSubmit}
      >
        <Popover open={isEmojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
            <PopoverTrigger asChild>
                <Button type="button" size="icon" variant="ghost">
                    <Smile className="h-6 w-6" />
                    <span className="sr-only">Emoji</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-0">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </PopoverContent>
        </Popover>

        <Input
          placeholder="Type a message"
          className="flex-1 h-11 rounded-full bg-background px-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit" size="icon" className="rounded-full bg-primary h-11 w-11" disabled={!message.trim()}>
          <Send className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
