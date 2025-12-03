export interface Transaction {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  status: 'completed' | 'failed';
}

export interface UserState {
  merchantName: string; // New field
  balance: number;
  xp: number;
  level: number;
  completedTutorial: boolean;
  unlockedItems: string[];
  transactions: Transaction[]; // New field
}

export interface Product {
  id: string;
  name: string;
  price: number;
  icon?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewardXP: number;
  duration: string;
  locked: boolean;
  iconName: string;
  color: string;
}

export interface Upgrade {
  id: string;
  title: string;
  description: string;
  cost: number;
  iconName: string;
  purchased: boolean;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  dialogue: string;
  desiredItems: Product[]; // The items they explicitly want
}