export type User = {
  id: string;
  fullName: string;
  avatar: string;
  online: boolean;
  department: string;
  semester: string;
  accountType: 'Public' | 'Private';
  gender?: 'Male' | 'Female';
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'read';
  deletedFor?: string[];
};

export type Conversation = {
  id:string;
  user: User;
  messages: Message[];
  unreadCount: number;
};
