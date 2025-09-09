
"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type User } from "@/lib/data";
import { DEPARTMENTS, SEMESTERS } from "@/lib/constants";
import { ScrollArea } from "./ui/scroll-area";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { UserProfileDialog } from "./user-profile-dialog";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";

type UserListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartConversation: (user: User) => void;
};

export function UserListDialog({ open, onOpenChange, onStartConversation }: UserListDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!authUser) return;
      setLoading(true);
      try {
        const usersCollection = collection(db, "users");
        // Query for users where emailVerified is true
        const q = query(usersCollection, where("emailVerified", "==", true));
        const userSnapshot = await getDocs(q);
        const usersList = userSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                fullName: data.fullName || '',
                avatar: data.avatarUrl,
                online: Math.random() > 0.5,
                department: data.department,
                semester: data.semester,
                accountType: data.accountType,
                gender: data.gender,
            } as User;
        });
        setAllUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if(open) {
      fetchUsers();
    }
  }, [open, authUser]);

  const [filters, setFilters] = useState({
    department: "all",
    semester: "all",
    gender: "all",
    accountType: "all",
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const allDepartments = useMemo(() => Object.values(DEPARTMENTS).flat(), []);

  const filteredUsers = useMemo(() => allUsers.filter(user => {
    return (
      (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? true) &&
      (filters.department !== 'all' ? user.department === filters.department : true) &&
      (filters.semester !== 'all' ? user.semester === filters.semester : true) &&
      (filters.gender !== 'all' ? user.gender?.toLowerCase() === filters.gender : true) &&
      (filters.accountType !== 'all' ? user.accountType.toLowerCase() === filters.accountType : true)
    );
  }), [allUsers, searchTerm, filters]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };
  
  const handleStartChatFromProfile = () => {
    if(selectedUser) {
        onStartConversation(selectedUser);
        setSelectedUser(null); // Close profile dialog
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px] grid-rows-[auto_auto_minmax(0,1fr)] p-0 max-h-[90dvh]">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Find Buddies</DialogTitle>
            <DialogDescription>
              Browse and connect with other students from NED.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 px-6 pb-4 border-b">
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
                <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {allDepartments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.semester} onValueChange={(value) => handleFilterChange('semester', value)}>
                <SelectTrigger><SelectValue placeholder="Semester" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {SEMESTERS.map((sem) => <SelectItem key={sem} value={sem}>{sem}</SelectItem>)}
                </SelectContent>
              </Select>
               <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
                <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                <SelectContent>
                   <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.accountType} onValueChange={(value) => handleFilterChange('accountType', value)}>
                <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ScrollArea>
            <div className="p-6 space-y-2">
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleUserSelect(user)}>
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-transparent hover:border-primary transition-all">
                            <AvatarImage
                              src={user.avatar}
                              alt={user.fullName}
                              data-ai-hint="person portrait"
                            />
                            <AvatarFallback>
                              {user.fullName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {user.online && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-blue-500 border-2 border-background" />
                          )}
                        </div>
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{user.fullName} {user.id === authUser?.uid && <span className="text-xs text-muted-foreground">(You)</span>}</p>
                          {user.accountType === "Private" && (
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user.department} - {user.semester} Semester
                        </p>
                      </div>
                    </div>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStartConversation(user)}
                        disabled={user.accountType === 'Private' && user.id !== authUser?.uid}
                      >
                         Chat
                      </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  No users found.
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      {selectedUser && (
        <UserProfileDialog
          user={selectedUser}
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
          onStartChat={handleStartChatFromProfile}
        />
      )}
    </>
  );
}
