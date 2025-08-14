import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, List, BarChart3, Settings, Trophy } from "lucide-react";
import Header from "./components/Header/Header";
import TaskList from "./components/TaskList/TaskList";
import TaskForm from "./components/TaskForm/TaskForm";
import Stats from "./components/Stats/Stats";
import Achievements from "./components/Achievements/Achievements";
import "./styles/globals.scss";
import "./App.scss";

type TabType = "home" | "quests" | "stats" | "achievements" | "settings";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const tabs = [
    { id: "home", label: "Главная", icon: Home },
    { id: "quests", label: "Задания", icon: List },
    { id: "stats", label: "Статистика", icon: BarChart3 },
    { id: "achievements", label: "Награды", icon: Trophy },
    { id: "settings", label: "Настройки", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="app__content"
          >
            <div className="app__welcome">
              <h1 className="app__welcome-title">
                Добро пожаловать в{" "}
                <span className="text-gradient">Solo Leveling</span>
              </h1>
              <p className="app__welcome-subtitle">
                Твоя персональная система заданий для повышения уровня жизни
              </p>
            </div>

            <div className="app__quick-actions">
              <TaskForm />
            </div>

            <div className="app__recent-quests">
              <h2 className="app__section-title">Недавние квесты</h2>
              <TaskList />
            </div>
          </motion.div>
        );

      case "quests":
        return (
          <motion.div
            key="quests"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="app__content"
          >
            <div className="app__quests-header">
              <h1 className="app__page-title">Доска заданий</h1>
              <TaskForm />
            </div>
            <TaskList />
          </motion.div>
        );

      case "stats":
        return (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="app__content"
          >
            <h1 className="app__page-title">Личная статистика</h1>
            <Stats />
          </motion.div>
        );

      case "achievements":
        return (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="app__content"
          >
            <h1 className="app__page-title">Награды</h1>
            <Achievements />
          </motion.div>
        );

      case "settings":
        return (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="app__content"
          >
            <h1 className="app__page-title">Настройки</h1>
            <div className="app__settings">
              <div className="card">
                <h3>Скоро!</h3>
                <p>
                  Настройки и кастомизированные опции будут доступны в будущем
                  обновлении.
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Header />

      <main className="app__main">
        <div className="container">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </main>

      <nav className="app__navigation">
        <div className="app__nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`app__nav-tab ${
                  activeTab === tab.id ? "app__nav-tab--active" : ""
                }`}
                onClick={() => setActiveTab(tab.id as TabType)}
              >
                <Icon className="app__nav-icon" />
                <span className="app__nav-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;
