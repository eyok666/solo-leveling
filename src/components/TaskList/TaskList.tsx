import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search } from "lucide-react";
import { useAppStore } from "../../store";
import { type Task } from "../../types";
import TaskCard from "../TaskCard/TaskCard";
import "./TaskList.scss";

const TaskList: React.FC = () => {
  const { tasks } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<Task["type"] | "all">("all");
  const [filterDifficulty, setFilterDifficulty] = useState<
    Task["difficulty"] | "all"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "pending"
  >("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === "all" || task.type === filterType;
      const matchesDifficulty =
        filterDifficulty === "all" || task.difficulty === filterDifficulty;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "completed" && task.completed) ||
        (filterStatus === "pending" && !task.completed);

      return matchesSearch && matchesType && matchesDifficulty && matchesStatus;
    });
  }, [tasks, searchTerm, filterType, filterDifficulty, filterStatus]);

  const groupedTasks = useMemo(() => {
    const groups = {
      daily: filteredTasks.filter((task) => task.type === "daily"),
      weekly: filteredTasks.filter((task) => task.type === "weekly"),
      monthly: filteredTasks.filter((task) => task.type === "monthly"),
      yearly: filteredTasks.filter((task) => task.type === "yearly"),
    };

    return groups;
  }, [filteredTasks]);

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

  return (
    <div className="task-list">
      <div className="task-list__header">
        <div className="task-list__search">
          <Search className="task-list__search-icon" />
          <input
            type="text"
            className="task-list__search-input"
            placeholder="Поиск заданий..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="task-list__filters">
          <div className="task-list__filter-group">
            <Filter className="task-list__filter-icon" />
            <select
              className="task-list__filter-select"
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as Task["type"] | "all")
              }
            >
              <option value="all">Все типы</option>
              <option value="daily">Дневные</option>
              <option value="weekly">Недельные</option>
              <option value="monthly">Месячные</option>
              <option value="yearly">Годовые</option>
            </select>
          </div>

          <div className="task-list__filter-group">
            <select
              className="task-list__filter-select"
              value={filterDifficulty}
              onChange={(e) =>
                setFilterDifficulty(
                  e.target.value as Task["difficulty"] | "all"
                )
              }
            >
              <option value="all">Любая сложность</option>
              <option value="easy">Лёгкие</option>
              <option value="medium">Средние</option>
              <option value="hard">Сложные</option>
              <option value="legendary">Легендарные</option>
            </select>
          </div>

          <div className="task-list__filter-group">
            <select
              className="task-list__filter-select"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "all" | "completed" | "pending"
                )
              }
            >
              <option value="all">Все статусы</option>
              <option value="pending">Ожидающие</option>
              <option value="completed">Выполнено</option>
            </select>
          </div>
        </div>
      </div>

      <div className="task-list__content">
        {filteredTasks.length === 0 ? (
          <motion.div
            className="task-list__empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="task-list__empty-icon">🎯</div>
            <h3 className="task-list__empty-title">Задания не найдены</h3>
            <p className="task-list__empty-text">
              {searchTerm ||
              filterType !== "all" ||
              filterDifficulty !== "all" ||
              filterStatus !== "all"
                ? "Попробуйте изменить фильтры или условия поиска"
                : "Создайте своё первое задание, чтобы начать своё путешествие!"}
            </p>
          </motion.div>
        ) : (
          <div className="task-list__groups">
            {Object.entries(groupedTasks).map(([type, typeTasks]) => {
              if (typeTasks.length === 0) return null;

              return (
                <motion.div
                  key={type}
                  className="task-list__group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="task-list__group-header">
                    <span className="task-list__group-icon">
                      {getTypeIcon(type as Task["type"])}
                    </span>
                    <h2 className="task-list__group-title">
                      {type.charAt(0).toUpperCase() + type.slice(1)} Задания
                    </h2>
                    <span className="task-list__group-count">
                      {typeTasks.length}
                    </span>
                  </div>

                  <div className="task-list__group-content">
                    <AnimatePresence>
                      {typeTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
