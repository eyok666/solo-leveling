import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Task,
  Player,
  Achievement,
  TaskCategory,
  ProgressStats,
} from "../types";

interface AppState {
  // Player data
  player: Player;
  tasks: Task[];
  achievements: Achievement[];
  categories: TaskCategory[];
  stats: ProgressStats;

  // Actions
  addTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addExperience: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  checkAchievements: () => void;
  resetDailyTasks: () => void;
  resetWeeklyTasks: () => void;
  resetMonthlyTasks: () => void;
  resetYearlyTasks: () => void;
}

const calculateLevel = (experience: number): number => {
  return Math.floor(experience / 100) + 1;
};

const calculateExperienceToNext = (experience: number): number => {
  const currentLevel = calculateLevel(experience);
  const nextLevelExp = currentLevel * 100;
  return nextLevelExp - experience;
};

const getRank = (level: number): string => {
  if (level < 10) return "F-Rank Hunter";
  if (level < 20) return "E-Rank Hunter";
  if (level < 30) return "D-Rank Hunter";
  if (level < 40) return "C-Rank Hunter";
  if (level < 50) return "B-Rank Hunter";
  if (level < 60) return "A-Rank Hunter";
  if (level < 70) return "S-Rank Hunter";
  if (level < 80) return "SS-Rank Hunter";
  if (level < 90) return "SSS-Rank Hunter";
  return "Monarch";
};

const initialPlayer: Player = {
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
  totalExperience: 0,
  rank: "F-Rank Hunter",
  stats: {
    strength: 10,
    agility: 10,
    intelligence: 10,
    charisma: 10,
  },
  achievements: [],
};

const initialCategories: TaskCategory[] = [
  {
    id: "health",
    name: "Здоровье и фитнес",
    color: "#ff6b6b",
    icon: "💪",
    description: "Задачи по физической подготовке и оздоровлению",
  },
  {
    id: "learning",
    name: "Обучение и навыки",
    color: "#4ecdc4",
    icon: "📚",
    description: "Задачи в области образования и повышения квалификации",
  },
  {
    id: "work",
    name: "Работа и карьера",
    color: "#45b7d1",
    icon: "💼",
    description: "Задачи профессионального развития",
  },
  {
    id: "personal",
    name: "Личностный рост",
    color: "#96ceb4",
    icon: "🌱",
    description: "Личностное развитие и привычки",
  },
  {
    id: "social",
    name: "Общение и взаимоотношения",
    color: "#feca57",
    icon: "👥",
    description: "Социальные взаимодействия и взаимоотношения",
  },
];

const initialAchievements: Achievement[] = [
  {
    id: "first_task",
    title: "Первые шаги",
    description: "Завершите своё первое задание",
    icon: "🎯",
    unlocked: false,
    experienceReward: 50,
    requirements: [{ type: "task_completion", value: 1 }],
    category: "task",
    rarity: "common",
  },
  {
    id: "streak_7",
    title: "Воин недели",
    description: "Поддерживайте 7-дневную серию тренировок",
    icon: "🔥",
    unlocked: false,
    experienceReward: 200,
    requirements: [{ type: "streak_days", value: 7 }],
    category: "streak",
    rarity: "rare",
  },
  {
    id: "level_10",
    title: "Восходящая звезда",
    description: "Достигните 10-го уровня",
    icon: "⭐",
    unlocked: false,
    experienceReward: 500,
    requirements: [{ type: "level_reach", value: 10 }],
    category: "level",
    rarity: "epic",
  },
  {
    id: "daily_master",
    title: "Ежедневный мастер",
    description: "Выполните 10 ежедневных заданий",
    icon: "🌅",
    unlocked: false,
    experienceReward: 150,
    requirements: [{ type: "task_count", value: 10, taskType: "daily" }],
    category: "task",
    rarity: "common",
  },
  {
    id: "weekly_champion",
    title: "Еженедельный чемпион",
    description: "Выполните 5 еженедельных заданий",
    icon: "📅",
    unlocked: false,
    experienceReward: 300,
    requirements: [{ type: "task_count", value: 5, taskType: "weekly" }],
    category: "task",
    rarity: "rare",
  },
  {
    id: "legendary_hunter",
    title: "Легендарный игрок",
    description: "Выполните 3 легендарных задания повышенной сложности",
    icon: "👑",
    unlocked: false,
    experienceReward: 1000,
    requirements: [{ type: "task_count", value: 3, difficulty: "legendary" }],
    category: "task",
    rarity: "legendary",
  },
  {
    id: "health_enthusiast",
    title: "Энтузиаст здоровья",
    description: "Выполните 15 заданий по здоровью и фитнесу",
    icon: "💪",
    unlocked: false,
    experienceReward: 400,
    requirements: [
      { type: "category_completion", value: 15, category: "health" },
    ],
    category: "task",
    rarity: "rare",
  },
  {
    id: "knowledge_seeker",
    title: "Искатель знаний",
    description: "Выполните 20 заданий по обучению и навыкам",
    icon: "📚",
    unlocked: false,
    experienceReward: 600,
    requirements: [
      { type: "category_completion", value: 20, category: "learning" },
    ],
    category: "task",
    rarity: "epic",
  },
  {
    id: "streak_30",
    title: "Король последовательности",
    description: "Поддерживайте 30-дневную серию тренировок",
    icon: "🔥",
    unlocked: false,
    experienceReward: 1000,
    requirements: [{ type: "streak_days", value: 30 }],
    category: "streak",
    rarity: "legendary",
  },
  {
    id: "level_50",
    title: "Элитный охотник",
    description: "Достигните 50-го уровня",
    icon: "⭐",
    unlocked: false,
    experienceReward: 2000,
    requirements: [{ type: "level_reach", value: 50 }],
    category: "level",
    rarity: "legendary",
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      player: initialPlayer,
      tasks: [],
      achievements: initialAchievements,
      categories: initialCategories,
      stats: {
        dailyCompleted: 0,
        weeklyCompleted: 0,
        monthlyCompleted: 0,
        yearlyCompleted: 0,
        streakDays: 0,
        totalTasksCompleted: 0,
      },

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date(),
          completed: false,
        };
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
      },

      completeTask: (taskId) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task || task.completed) return state;

          const updatedTasks = state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, completed: true, completedAt: new Date() }
              : t
          );

          const newExperience = state.player.experience + task.experience;
          const newLevel = calculateLevel(newExperience);
          const newExperienceToNext = calculateExperienceToNext(newExperience);
          const newRank = getRank(newLevel);

          const newStats = {
            ...state.stats,
            totalTasksCompleted: state.stats.totalTasksCompleted + 1,
            [task.type === "daily"
              ? "dailyCompleted"
              : task.type === "weekly"
              ? "weeklyCompleted"
              : task.type === "monthly"
              ? "monthlyCompleted"
              : "yearlyCompleted"]:
              state.stats[
                task.type === "daily"
                  ? "dailyCompleted"
                  : task.type === "weekly"
                  ? "weeklyCompleted"
                  : task.type === "monthly"
                  ? "monthlyCompleted"
                  : "yearlyCompleted"
              ] + 1,
          };

          return {
            tasks: updatedTasks,
            player: {
              ...state.player,
              level: newLevel,
              experience: newExperience,
              experienceToNextLevel: newExperienceToNext,
              totalExperience: state.player.totalExperience + task.experience,
              rank: newRank,
            },
            stats: newStats,
          };
        });

        // Check for new achievements after completing a task
        setTimeout(() => {
          get().checkAchievements();
        }, 100);
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        }));
      },

      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
          ),
        }));
      },

      addExperience: (amount) => {
        set((state) => {
          const newExperience = state.player.experience + amount;
          const newLevel = calculateLevel(newExperience);
          const newExperienceToNext = calculateExperienceToNext(newExperience);
          const newRank = getRank(newLevel);

          return {
            player: {
              ...state.player,
              level: newLevel,
              experience: newExperience,
              experienceToNextLevel: newExperienceToNext,
              totalExperience: state.player.totalExperience + amount,
              rank: newRank,
            },
          };
        });
      },

      unlockAchievement: (achievementId) => {
        set((state) => {
          const achievement = state.achievements.find(
            (a) => a.id === achievementId
          );
          if (!achievement || achievement.unlocked) return state;

          const updatedAchievements = state.achievements.map((a) =>
            a.id === achievementId
              ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
              : a
          );

          return {
            achievements: updatedAchievements,
          };
        });

        // Add experience reward
        const achievement = get().achievements.find(
          (a) => a.id === achievementId
        );
        if (achievement) {
          get().addExperience(achievement.experienceReward);
        }
      },

      checkAchievements: () => {
        const state = get();
        const { tasks, player, stats, achievements } = state;

        const completedTasks = tasks.filter((task) => task.completed);

        achievements.forEach((achievement) => {
          if (achievement.unlocked) return;

          let shouldUnlock = true;

          achievement.requirements.forEach((requirement) => {
            let currentValue = 0;

            switch (requirement.type) {
              case "task_completion":
                currentValue = completedTasks.length;
                break;
              case "task_count":
                if (requirement.taskType) {
                  currentValue = completedTasks.filter(
                    (task) => task.type === requirement.taskType
                  ).length;
                } else if (requirement.difficulty) {
                  currentValue = completedTasks.filter(
                    (task) => task.difficulty === requirement.difficulty
                  ).length;
                }
                break;
              case "streak_days":
                currentValue = stats.streakDays;
                break;
              case "level_reach":
                currentValue = player.level;
                break;
              case "category_completion":
                if (requirement.category) {
                  currentValue = completedTasks.filter(
                    (task) => task.category === requirement.category
                  ).length;
                }
                break;
            }

            if (currentValue < requirement.value) {
              shouldUnlock = false;
            }
          });

          if (shouldUnlock) {
            get().unlockAchievement(achievement.id);
          }
        });
      },

      resetDailyTasks: () => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.type === "daily"
              ? { ...task, completed: false, completedAt: undefined }
              : task
          ),
        }));
      },

      resetWeeklyTasks: () => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.type === "weekly"
              ? { ...task, completed: false, completedAt: undefined }
              : task
          ),
        }));
      },

      resetMonthlyTasks: () => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.type === "monthly"
              ? { ...task, completed: false, completedAt: undefined }
              : task
          ),
        }));
      },

      resetYearlyTasks: () => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.type === "yearly"
              ? { ...task, completed: false, completedAt: undefined }
              : task
          ),
        }));
      },
    }),
    {
      name: "solo-leveling-storage",
      partialize: (state) => ({
        player: state.player,
        tasks: state.tasks,
        achievements: state.achievements,
        categories: state.categories,
        stats: state.stats,
      }),
    }
  )
);
