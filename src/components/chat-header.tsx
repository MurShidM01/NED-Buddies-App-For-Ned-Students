import { User } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ArrowLeft, MoreVertical, ShieldBan } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type ChatHeaderProps = {
  user: User;
  onBack: () => void;
  onShowProfile: () => void;
};

export function ChatHeader({ user, onBack, onShowProfile }: ChatHeaderProps) {
  const { toast } = useToast();

  const handleBlockUser = () => {
    toast({
        title: "User Blocked",
        description: `You have blocked ${user.fullName}. You will no longer receive messages from them.`,
    });
    // In a real app, you would add logic here to update Firebase
    console.log(`User ${user.fullName} blocked.`);
  };

  return (
    <div className="flex h-16 items-center gap-4 border-b bg-secondary px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
        <ArrowLeft />
      </Button>
      <div className="flex items-center gap-3 cursor-pointer" onClick={onShowProfile}>
        <div className="relative">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={user.avatar} alt={user.fullName} data-ai-hint="person portrait"/>
            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
           {user.online && (
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-secondary" />
           )}
        </div>
        <div className="grid gap-0.5">
          <p className="font-semibold">{user.fullName}</p>
          <p className="text-xs text-muted-foreground">
            {user.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onShowProfile}>
                    View Profile
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={handleBlockUser} className="text-destructive">
                    <ShieldBan className="mr-2 h-4 w-4" />
                    <span>Block User</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
