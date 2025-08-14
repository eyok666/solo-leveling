import React from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Award } from "lucide-react";
import { type Achievement } from "../../types";
import { useAppStore } from "../../store";
import "./AchievementProgress.scss";

const AchievementProgress: React.FC = () => {
  const { achievements, tasks } = useAppStore();

  const completedTasks = tasks.filter((task) => task.completed);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  const getProgressForAchievement = (achievement: Achievement) => {
    if (!achievement.requirements || achievement.requirements.length === 0) {
      return { current: 0, target: 1, percentage: 0 };
    }

    const requirement = achievement.requirements[0]; // Simplified for now
    let current = 0;
    const target = requirement.value;

    switch (requirement.type) {
      case "task_completion":
        current = completedTasks.length;
        break;
      case "task_count":
        if (requirement.taskType) {
          current = completedTasks.filter(
            (task) => task.type === requirement.taskType
          ).length;
        } else if (requirement.difficulty) {
          current = completedTasks.filter(
            (task) => task.difficulty === requirement.difficulty
          ).length;
        }
        break;
      case "category_completion":
        if (requirement.category) {
          current = completedTasks.filter(
            (task) => task.category === requirement.category
          ).length;
        }
        break;
      default:
        return { current: 0, target: 1, percentage: 0 };
    }

    const percentage = Math.min((current / target) * 100, 100);
    return { current, target, percentage };
  };

  const getAchievementDescription = (achievement: Achievement) => {
    if (!achievement.requirements || achievement.requirements.length === 0) {
      return achievement.description;
    }

    const requirement = achievement.requirements[0];

    switch (requirement.type) {
      case "task_completion":
        return `Выполните ${requirement.value} задани${
          requirement.value > 1 ? "й" : "е"
        }`;
      case "task_count":
        if (requirement.taskType) {
          return `Выполните ${requirement.value} ${
            requirement.taskType
          } задани${requirement.value > 1 ? "й" : "е"}`;
        } else if (requirement.difficulty) {
          return `Выполните ${requirement.value} ${
            requirement.difficulty
          } задани${requirement.value > 1 ? "й" : "е"}`;
        }
        break;
      case "category_completion":
        if (requirement.category) {
          return `Выполните ${requirement.value} ${
            requirement.category
          } задани${requirement.value > 1 ? "й" : "е"}`;
        }
        break;
      default:
        return achievement.description;
    }

    return achievement.description;
  };

  if (lockedAchievements.length === 0) {
    return (
      <div className="achievement-progress">
        <div className="achievement-progress__header">
          <Award className="achievement-progress__icon" />
          <h3>Награды</h3>
        </div>
        <div className="achievement-progress__empty">
          <p>🎉 Все награды разблокированы!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="achievement-progress">
      <div className="achievement-progress__header">
        <Target className="achievement-progress__icon" />
        <h3>Следующие награды</h3>
      </div>

      <div className="achievement-progress__list">
        {lockedAchievements.slice(0, 3).map((achievement) => {
          const progress = getProgressForAchievement(achievement);

          return (
            <motion.div
              key={achievement.id}
              className="achievement-progress__item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="achievement-progress__item-header">
                <div className="achievement-progress__item-icon">
                  <span>{achievement.icon}</span>
                </div>
                <div className="achievement-progress__item-info">
                  <h4 className="achievement-progress__item-title">
                    {achievement.title}
                  </h4>
                  <p className="achievement-progress__item-description">
                    {getAchievementDescription(achievement)}
                  </p>
                </div>
                <div className="achievement-progress__item-reward">
                  <TrendingUp className="achievement-progress__reward-icon" />
                  <span>+{achievement.experienceReward}</span>
                </div>
              </div>

              <div className="achievement-progress__item-progress">
                <div className="achievement-progress__progress-bar">
                  <motion.div
                    className="achievement-progress__progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="achievement-progress__progress-text">
                  {progress.current}/{progress.target}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {lockedAchievements.length > 3 && (
        <div className="achievement-progress__more">
          <p>ещё +{lockedAchievements.length - 3} наград для разблокировки</p>
        </div>
      )}
    </div>
  );
};

export default AchievementProgress;
