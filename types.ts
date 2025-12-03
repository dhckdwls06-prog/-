export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum TaskCategory {
  EXERCISE = '운동',
  STUDY = '공부',
  HOBBY = '취미',
  LIFESTYLE = '생활'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  xp: number;
  coins: number;
  category: TaskCategory;
  difficulty: Difficulty;
  completed: boolean;
  isCustom?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface UserStats {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  coins: number;
  streakDays: number;
  totalTasksCompleted: number;
  moodHistory: { date: string; score: number }[]; // 1-5 score
  inventory: string[]; // List of purchased item IDs
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  condition: (stats: UserStats) => boolean;
}

export interface StoreItem {
  id: string;
  name: string;
  price: number; // in coins
  priceKrw: number; // visual reference (1 coin = 100krw)
  icon: string;
  description: string;
}

export type ViewState = 'dashboard' | 'quests' | 'chat' | 'stats' | 'store';