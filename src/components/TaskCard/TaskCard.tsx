import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, Clock, Star, Trophy } from "lucide-react";
import { type Task, type Achievement } from "../../types";
import { useAppStore } from "../../store";
import "./TaskCard.scss";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { completeTask, deleteTask, achievements } = useAppStore();
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(
    null
  );
  const [prevAchievements, setPrevAchievements] = useState(achievements);

  useEffect(() => {
    // Check if any new achievements were unlocked
    const newUnlocked = achievements.filter(
      (a) =>
        a.unlocked &&
        !prevAchievements.find((pa) => pa.id === a.id && pa.unlocked)
    );
    if (newUnlocked.length > 0) {
      setNewAchievement(newUnlocked[0]);
      setTimeout(() => setNewAchievement(null), 3000);
    }
    setPrevAchievements(achievements);
  }, [achievements, prevAchievements]);

  const getDifficultyColor = (difficulty: Task["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "var(--accent-green)";
      case "medium":
        return "var(--accent-gold)";
      case "hard":
        return "var(--accent-red)";
      case "legendary":
        return "var(--accent-purple)";
      default:
        return "var(--text-muted)";
    }
  };

  const getTypeIcon = (type: Task["type"]) => {
    switch (type) {
      case "daily":
        return "🌅";
      case "weekly":
        return "📅";
      case "monthly":
        return "📆";
      case "yearly":
        return "🎯";
      default:
        return "📝";
    }
  };

  const handleComplete = () => {
    if (!task.completed) {
      completeTask(task.id);
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <motion.div
      className={`task-card ${task.completed ? "task-card--completed" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="task-card__header">
        <div className="task-card__type">
          <span className="task-card__type-icon">{getTypeIcon(task.type)}</span>
          <span className="task-card__type-text">{task.type}</span>
        </div>

        <div className="task-card__difficulty">
          <Star
            className="task-card__difficulty-icon"
            style={{ color: getDifficultyColor(task.difficulty) }}
          />
          <span className="task-card__difficulty-text">{task.difficulty}</span>
        </div>
      </div>

      <div className="task-card__content">
        <h3 className="task-card__title">{task.title}</h3>
        <p className="task-card__description">{task.description}</p>

        <div className="task-card__experience">
          <Clock className="task-card__experience-icon" />
          <span className="task-card__experience-text">
            +{task.experience} EXP
          </span>
        </div>
      </div>

      <div className="task-card__footer">
        <div className="task-card__category">
          <span className="task-card__category-badge">{task.category}</span>
        </div>

        <div className="task-card__actions">
          {!task.completed && (
            <motion.button
              className="btn btn-success task-card__action"
              onClick={handleComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Check className="task-card__action-icon" />
              Выполнить
            </motion.button>
          )}

          <motion.button
            className="btn btn-danger task-card__action"
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 className="task-card__action-icon" />
            Удалить
          </motion.button>
        </div>
      </div>

      {task.completed && (
        <div className="task-card__completed-overlay">
          <Check className="task-card__completed-icon" />
          <span>Выполнено!</span>
        </div>
      )}

      {/* Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            className="achievement-notification"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="achievement-notification__content">
              <Trophy className="achievement-notification__icon" />
              <div className="achievement-notification__text">
                <h4>Награда разблокирована!</h4>
                <p>{newAchievement.title}</p>
                <span>+{newAchievement.experienceReward} EXP</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCard;
