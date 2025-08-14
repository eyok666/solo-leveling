import React from "react";
import { motion } from "framer-motion";
import { Crown, Trophy, Zap } from "lucide-react";
import { useAppStore } from "../../store";
import "./Header.scss";

const Header: React.FC = () => {
  const { player, stats } = useAppStore();

  const progressPercentage = ((player.experience % 100) / 100) * 100;

  return (
    <motion.header
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="header__content">
          <div className="header__left">
            <h1 className="header__title">
              <span className="text-gradient">Solo Leveling</span>
            </h1>
            <p className="header__subtitle">
              Твоя персональная система заданий
            </p>
          </div>

          <div className="header__right">
            <div className="player-stats">
              <div className="player-stats__level">
                <div className="player-stats__level-info">
                  <span className="player-stats__level-number">
                    Lv.{player.level}
                  </span>
                  <span className="player-stats__exp">
                    {player.experience % 100}/{100} EXP
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar__fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="player-stats__rank">
                <Crown className="player-stats__icon" />
                <span className="player-stats__text">{player.rank}</span>
              </div>

              <div className="player-stats__total">
                <Trophy className="player-stats__icon" />
                <span className="player-stats__text">
                  {stats.totalTasksCompleted} Выполнено
                </span>
              </div>

              <div className="player-stats__streak">
                <Zap className="player-stats__icon" />
                <span className="player-stats__text">
                  {stats.streakDays} Дней подряд
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
