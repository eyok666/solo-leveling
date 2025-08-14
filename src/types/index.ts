export interface Task {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly" | "yearly";
  experience: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  difficulty: "easy" | "medium" | "hard" | "legendary";
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date | string;
  experienceReward: number;
  requirements: AchievementRequirement[];
  category: "task" | "streak" | "level" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface AchievementRequirement {
  type:
    | "task_completion"
    | "task_count"
    | "streak_days"
    | "level_reach"
    | "category_completion";
  value: number;
  category?: string;
  difficulty?: Task["difficulty"];
  taskType?: Task["type"];
}

export interface Player {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalExperience: number;
  rank: string;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    charisma: number;
  };
  achievements: Achievement[];
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
}

export interface ProgressStats {
  dailyCompleted: number;
  weeklyCompleted: number;
  monthlyCompleted: number;
  yearlyCompleted: number;
  streakDays: number;
  totalTasksCompleted: number;
}
