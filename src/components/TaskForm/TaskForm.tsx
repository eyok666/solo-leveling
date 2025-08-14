import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useAppStore } from "../../store";
import { type Task } from "../../types";
import AchievementProgress from "../AchievementProgress/AchievementProgress";
import "./TaskForm.scss";

const TaskForm: React.FC = () => {
  const { addTask, categories } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "daily" as Task["type"],
    difficulty: "easy" as Task["difficulty"],
    category: "",
    experience: 10,
  });

  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData((prev) => ({
        ...prev,
        category: categories[0].id,
      }));
    }
  }, [categories, formData.category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    const category = categories.find((c) => c.id === formData.category);

    addTask({
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      difficulty: formData.difficulty,
      category: category?.name || categories[0]?.name || "General",
      experience: formData.experience,
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      type: "daily",
      difficulty: "easy",
      category: "",
      experience: 10,
    });

    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getExperienceForDifficulty = (difficulty: Task["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return 10;
      case "medium":
        return 25;
      case "hard":
        return 50;
      case "legendary":
        return 100;
      default:
        return 10;
    }
  };

  return (
    <div className="task-form">
      <motion.button
        className="task-form__trigger btn btn-primary"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="task-form__trigger-icon" />
        Добавить задание
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="task-form__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="task-form__modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="task-form__header">
                <h2 className="task-form__title">Создать новое задание</h2>
                <button
                  className="task-form__close"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="task-form__close-icon" />
                </button>
              </div>

              <form className="task-form__form" onSubmit={handleSubmit}>
                <div className="task-form__field">
                  <label className="task-form__label">Название задания</label>
                  <input
                    type="text"
                    className="task-form__input"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Введите название задания..."
                    required
                  />
                </div>

                <div className="task-form__field">
                  <label className="task-form__label">Описание</label>
                  <textarea
                    className="task-form__textarea"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Расскажите о задании..."
                    rows={3}
                    required
                  />
                </div>

                <div className="task-form__row">
                  <div className="task-form__field">
                    <label className="task-form__label">Тип задания</label>
                    <select
                      className="task-form__select"
                      value={formData.type}
                      onChange={(e) =>
                        handleInputChange(
                          "type",
                          e.target.value as Task["type"]
                        )
                      }
                    >
                      <option value="daily">Дневной</option>
                      <option value="weekly">Недельный</option>
                      <option value="monthly">Месячный</option>
                      <option value="yearly">Годовой</option>
                    </select>
                  </div>

                  <div className="task-form__field">
                    <label className="task-form__label">Сложность</label>
                    <select
                      className="task-form__select"
                      value={formData.difficulty}
                      onChange={(e) => {
                        const difficulty = e.target.value as Task["difficulty"];
                        handleInputChange("difficulty", difficulty);
                        handleInputChange(
                          "experience",
                          getExperienceForDifficulty(difficulty)
                        );
                      }}
                    >
                      <option value="easy">Легкий</option>
                      <option value="medium">Средний</option>
                      <option value="hard">Сложный</option>
                      <option value="legendary">Легендарный</option>
                    </select>
                  </div>
                </div>

                <div className="task-form__row">
                  <div className="task-form__field">
                    <label className="task-form__label">Категория</label>
                    <select
                      className="task-form__select"
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="task-form__field">
                    <label className="task-form__label">Награда за опыт</label>
                    <input
                      type="number"
                      className="task-form__input"
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange(
                          "experience",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>

                <div className="task-form__actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    Отменить
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Создать задание
                  </button>
                </div>
              </form>

              <AchievementProgress />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskForm;
