export type Category = '烘焙' | '编织' | '木工' | '陶艺' | '皮具' | '花艺';

export type Difficulty = '简单' | '中等' | '较难';

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  workCount: number;
  followers: string[]; // user ids
}

export interface TutorialStep {
  image: string;
  text: string;
}

export interface Material {
  name: string;
  amount: string;
}

export interface Work {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  cover: string;
  authorId: string;
  description: string;
  steps: TutorialStep[];
  materials: Material[];
  tips: string;
  likes: string[];      // user ids
  favorites: string[];  // user ids
  comments: Comment[];
  createdAt: number;
  published: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  avatar: string;
}
