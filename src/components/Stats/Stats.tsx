import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  Award,
  Calendar,
  MessageSquareWarning,
} from "lucide-react";
import { useAppStore } from "../../store";
import "./Stats.scss";

const Stats: React.FC = () => {
  const { player, stats, achievements } = useAppStore();

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const completionRate =
    stats.totalTasksCompleted > 0
      ? Math.round(
          (stats.totalTasksCompleted /
            (stats.totalTasksCompleted +
              stats.dailyCompleted +
              stats.weeklyCompleted +
              stats.monthlyCompleted +
              stats.yearlyCompleted)) *
            100
        )
      : 0;

  const statCards = [
    {
      title: "Всего опыта",
      value: player.totalExperience.toLocaleString(),
      icon: TrendingUp,
      color: "var(--accent-blue)",
      description: "Весь накопленный опыт",
    },
    {
      title: "Выполненные задания",
      value: stats.totalTasksCompleted,
      icon: Target,
      color: "var(--accent-green)",
      description: "Общее количество выполненных заданий",
    },
    {
      title: "Награды",
      value: `${unlockedAchievements.length}/${achievements.length}`,
      icon: Award,
      color: "var(--accent-gold)",
      description: "Разблокированные награды",
    },
    {
      title: "Текущий стрик",
      value: `${stats.streakDays} дней`,
      icon: Calendar,
      color: "var(--accent-purple)",
      description: "Активные дни подряд",
    },
  ];

  return (
    <div className="stats">
      <div className="stats__header">
        <h2 className="stats__title">Личная статисткиа</h2>
        <div className="stats__completion">
          <span className="stats__completion-label">
            Коэффициент завершения работ
          </span>
          <span className="stats__completion-value">{completionRate}%</span>
        </div>
      </div>

      <div className="stats__grid">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="stats__card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="stats__card-header">
              <div
                className="stats__card-icon"
                style={{
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                <stat.icon className="stats__card-icon-svg" />
              </div>
              <div className="stats__card-info">
                <h3 className="stats__card-title">{stat.title}</h3>
                <p className="stats__card-description">{stat.description}</p>
              </div>
            </div>
            <div className="stats__card-value">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="stats__player-info">
        <div className="stats__player-card">
          {/* remove when idea finished */}
          <div className="stats__player-card__maintenance-overlay">
            <MessageSquareWarning className="stats__player-card__maintenance-icon" />
            <span>В разработке</span>
          </div>

          <h3 className="stats__player-title">Характеристика игрока</h3>
          <div className="stats__player-stats">
            <div className="stats__player-stat">
              <span className="stats__player-stat-label">Сила</span>
              <div className="stats__player-stat-bar">
                <div
                  className="stats__player-stat-fill"
                  style={{
                    width: `${(player.stats.strength / 100) * 100}%`,
                    backgroundColor: "var(--accent-red)",
                  }}
                />
              </div>
              <span className="stats__player-stat-value">
                {player.stats.strength}
              </span>
            </div>

            <div className="stats__player-stat">
              <span className="stats__player-stat-label">Ловкость</span>
              <div className="stats__player-stat-bar">
                <div
                  className="stats__player-stat-fill"
                  style={{
                    width: `${(player.stats.agility / 100) * 100}%`,
                    backgroundColor: "var(--accent-green)",
                  }}
                />
              </div>
              <span className="stats__player-stat-value">
                {player.stats.agility}
              </span>
            </div>

            <div className="stats__player-stat">
              <span className="stats__player-stat-label">Интеллект</span>
              <div className="stats__player-stat-bar">
                <div
                  className="stats__player-stat-fill"
                  style={{
                    width: `${(player.stats.intelligence / 100) * 100}%`,
                    backgroundColor: "var(--accent-blue)",
                  }}
                />
              </div>
              <span className="stats__player-stat-value">
                {player.stats.intelligence}
              </span>
            </div>

            <div className="stats__player-stat">
              <span className="stats__player-stat-label">Харизма</span>
              <div className="stats__player-stat-bar">
                <div
                  className="stats__player-stat-fill"
                  style={{
                    width: `${(player.stats.charisma / 100) * 100}%`,
                    backgroundColor: "var(--accent-purple)",
                  }}
                />
              </div>
              <span className="stats__player-stat-value">
                {player.stats.charisma}
              </span>
            </div>
          </div>
        </div>

        <div className="stats__achievements-card">
          <h3 className="stats__achievements-title">Последние достижения</h3>
          <div className="stats__achievements-list">
            {unlockedAchievements.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="stats__achievement">
                <span className="stats__achievement-icon">
                  {achievement.icon}
                </span>
                <div className="stats__achievement-info">
                  <h4 className="stats__achievement-title">
                    {achievement.title}
                  </h4>
                  <p className="stats__achievement-description">
                    {achievement.description}
                  </p>
                </div>
                <span className="stats__achievement-exp">
                  +{achievement.experienceReward}
                </span>
              </div>
            ))}
            {unlockedAchievements.length === 0 && (
              <p className="stats__achievements-empty">
                Достижения пока не разблокированы. Выполняйте задания, чтобы
                заработать достижения!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
