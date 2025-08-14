import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Lock, Unlock, Star, Target, Flame, Crown } from "lucide-react";
import { type Achievement } from "../../types";
import { useAppStore } from "../../store";
import "./Achievements.scss";

const Achievements: React.FC = () => {
  const { achievements } = useAppStore();
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case "🎯":
        return <Target className="achievement-icon" />;
      case "🔥":
        return <Flame className="achievement-icon" />;
      case "⭐":
        return <Star className="achievement-icon" />;
      case "👑":
        return <Crown className="achievement-icon" />;
      default:
        return <span className="achievement-icon-text">{icon}</span>;
    }
  };

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "var(--text-muted)";
      case "rare":
        return "var(--accent-blue)";
      case "epic":
        return "var(--accent-purple)";
      case "legendary":
        return "var(--accent-gold)";
      default:
        return "var(--text-muted)";
    }
  };

  const getRarityBorder = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "2px solid var(--border-color)";
      case "rare":
        return "2px solid var(--accent-blue)";
      case "epic":
        return "2px solid var(--accent-purple)";
      case "legendary":
        return "2px solid var(--accent-gold)";
      default:
        return "2px solid var(--border-color)";
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="achievements">
      <div className="achievements__header">
        <div className="achievements__title">
          <Trophy className="achievements__title-icon" />
          <h2>Награды</h2>
        </div>
        <div className="achievements__progress">
          <span className="achievements__progress-text">
            {unlockedCount}/{totalCount}
          </span>
          <div className="achievements__progress-bar">
            <motion.div
              className="achievements__progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="achievements__grid">
        <AnimatePresence>
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className={`achievement-card ${
                achievement.unlocked ? "achievement-card--unlocked" : ""
              }`}
              style={{
                border: achievement.unlocked
                  ? getRarityBorder(achievement.rarity)
                  : "2px solid var(--border-color)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setSelectedAchievement(achievement)}
            >
              <div className="achievement-card__icon">
                {getAchievementIcon(achievement.icon)}
              </div>

              {achievement.unlocked ? (
                <Unlock className="achievement-card__unlock-icon" />
              ) : (
                <Lock className="achievement-card__lock-icon" />
              )}

              <div className="achievement-card__content">
                <h3 className="achievement-card__title">{achievement.title}</h3>
                <p className="achievement-card__description">
                  {achievement.description}
                </p>

                <div className="achievement-card__reward">
                  <Star className="achievement-card__reward-icon" />
                  <span className="achievement-card__reward-text">
                    +{achievement.experienceReward} EXP
                  </span>
                </div>

                <div className="achievement-card__rarity">
                  <span
                    className="achievement-card__rarity-badge"
                    style={{ color: getRarityColor(achievement.rarity) }}
                  >
                    {achievement.rarity?.toUpperCase() || "COMMON"}
                  </span>
                </div>

                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="achievement-card__unlocked-date">
                    Разблокирована:{" "}
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {achievement.unlocked && (
                <motion.div
                  className="achievement-card__glow"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="achievement-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              className="achievement-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="achievement-modal__header">
                <div className="achievement-modal__icon">
                  {getAchievementIcon(selectedAchievement.icon)}
                </div>
                <h2 className="achievement-modal__title">
                  {selectedAchievement.title}
                </h2>
              </div>

              <div className="achievement-modal__content">
                <p className="achievement-modal__description">
                  {selectedAchievement.description}
                </p>

                <div className="achievement-modal__reward">
                  <Star className="achievement-modal__reward-icon" />
                  <span className="achievement-modal__reward-text">
                    Награда за опыт: {selectedAchievement.experienceReward}
                  </span>
                </div>

                {selectedAchievement.unlocked &&
                  selectedAchievement.unlockedAt && (
                    <div className="achievement-modal__unlocked">
                      <Unlock className="achievement-modal__unlocked-icon" />
                      <span>
                        Разблокирован{" "}
                        {new Date(
                          selectedAchievement.unlockedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                {!selectedAchievement.unlocked && (
                  <div className="achievement-modal__locked">
                    <Lock className="achievement-modal__locked-icon" />
                    <span>
                      Заблокирован - Выполните условия для разблокирования
                    </span>
                  </div>
                )}
              </div>

              <button
                className="btn btn-primary achievement-modal__close"
                onClick={() => setSelectedAchievement(null)}
              >
                Закрыть
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;
