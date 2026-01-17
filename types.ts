
export enum PostType {
  LOOKING = 'LOOKING',
  HAVE = 'HAVE'
}

export enum Category {
  FOOD = 'Food',
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  SERVICES = 'Services',
  RENTALS = 'Rentals',
  SPARE_PARTS = 'Spare Parts',
  OTHER = 'Other'
}

export enum Condition {
  NEW = 'New',
  USED = 'Used',
  NOT_APPLICABLE = 'N/A'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
  plugScore: number;
  badges: string[];
  bio?: string; // 1️⃣6️⃣ Human Profiles
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  isHelpfulPlug: boolean;
  isAlternative: boolean;
  image?: string;
  upvotes: number;
  createdAt: number;
  reactions?: Reaction[]; // 5️⃣ Natural Conversations
}

export interface Post {
  id: string;
  type: PostType;
  title: string;
  description: string;
  category: Category;
  location: string;
  image?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: number;
  quantity?: string;
  condition?: Condition;
  urgency?: 'Low' | 'Medium' | 'High';
  isSolved: boolean;
  solvedCommentId?: string;
  gaveUpReason?: string;
  scarcitySignal?: string;
  isAnonymous?: boolean;
  thankedCount?: number; // 2️⃣ "Thanks for Plugging Me"
  reactions?: Reaction[];
}

export interface AppState {
  posts: Post[];
  comments: Comment[];
  currentUser: User | null;
}
