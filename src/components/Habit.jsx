import React, { useState } from "react";
import {
  Check,
  MoreHorizontal,
  Flame,
  Edit3,
  Archive,
  Trash2,
  RotateCcw,
  Plus,
  X,
  Heart,
  BookOpen,
  Activity,
  Brain,
  Briefcase,
  Leaf,
  Target,
} from "lucide-react";
import { Button, IconButton, Modal, Field } from "./UI.jsx";
import { useApp } from "../context/AppContext.jsx";
import { currentStreak, isScheduled, isCompleted } from "../utils/streaks.js";
import { dateKey } from "../utils/dates.js";
export const CATEGORIES = [
  "Health",
  "Fitness",
  "Learning",
  "Productivity",
  "Mindfulness",
  "Personal Growth",
  "Other",
];
export const ICONS = [
  { id: "heart", icon: Heart },
  { id: "book", icon: BookOpen },
  { id: "activity", icon: Activity },
  { id: "brain", icon: Brain },
  { id: "briefcase", icon: Briefcase },
  { id: "leaf", icon: Leaf },
  { id: "target", icon: Target },
];
export function HabitCard({ habit, onEdit, onDelete, compact = false }) {
  const { toggleComplete, saveHabit, notify } = useApp();
  const [menu, setMenu] = useState(false);
  const today = dateKey();
  const scheduled = isScheduled(habit, new Date());
  const completed = isCompleted(habit, today);
  const streak = currentStreak(habit);
  const Icon = ICONS.find((x) => x.id === habit.icon)?.icon || Leaf;
  return (
    <article
      className={`habit-card ${compact ? "habit-card-compact" : ""} ${completed ? "is-complete" : ""}`}
    >
      <div className={`habit-icon habit-color-${habit.color || "mint"}`}>
        <Icon size={19} />
      </div>
      <div className="habit-main">
        <div className="habit-name-row">
          <h3>{habit.name}</h3>
          {habit.archived && <span className="badge">Archived</span>}
        </div>
        <p>{habit.description || habit.category}</p>
        <div className="habit-meta">
          <span className="category-dot">{habit.category}</span>
          <span className="streak-meta">
            <Flame size={13} />
            {streak} day streak
          </span>
        </div>
      </div>
      <div className="habit-actions">
        {scheduled ? (
          <button
            className={`completion-toggle ${completed ? "checked" : ""}`}
            aria-label={
              completed
                ? `Undo ${habit.name} completion`
                : `Mark ${habit.name} complete`
            }
            aria-pressed={completed}
            onClick={() => toggleComplete(habit.id)}
          >
            {completed ? <Check size={16} /> : <span />}
          </button>
        ) : (
          <span className="not-scheduled">Not today</span>
        )}
        <div className="habit-menu-wrap">
          <IconButton
            label={`Actions for ${habit.name}`}
            onClick={() => setMenu(!menu)}
          >
            <MoreHorizontal size={19} />
          </IconButton>
          {menu && (
            <>
              <button
                className="menu-dismiss"
                onClick={() => setMenu(false)}
                aria-label="Close habit actions"
              />
              <div className="habit-menu">
                <button
                  onClick={() => {
                    onEdit(habit);
                    setMenu(false);
                  }}
                >
                  <Edit3 size={14} /> Edit habit
                </button>
                <button
                  onClick={() => {
                    saveHabit({ archived: !habit.archived }, habit.id);
                    notify(
                      habit.archived ? "Habit restored" : "Habit archived",
                    );
                    setMenu(false);
                  }}
                >
                  <Archive size={14} />
                  {habit.archived ? "Restore" : "Archive"}
                </button>
                <button
                  className="danger-text"
                  onClick={() => {
                    onDelete(habit);
                    setMenu(false);
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
export function HabitForm({ open, onClose, habit = null }) {
  const { saveHabit } = useApp();
  const [form, setForm] = useState({
    name: habit?.name || "",
    description: habit?.description || "",
    category: habit?.category || "Health",
    icon: habit?.icon || "leaf",
    color: habit?.color || "mint",
    frequency: habit?.frequency || "daily",
    weekdays: habit?.weekdays || [1, 2, 3, 4, 5, 6, 0],
    goal: habit?.goal || "",
  });
  const [error, setError] = useState("");
  React.useEffect(() => {
    if (open) {
      setForm({
        name: habit?.name || "",
        description: habit?.description || "",
        category: habit?.category || "Health",
        icon: habit?.icon || "leaf",
        color: habit?.color || "mint",
        frequency: habit?.frequency || "daily",
        weekdays: habit?.weekdays || [1, 2, 3, 4, 5, 6, 0],
        goal: habit?.goal || "",
      });
      setError("");
    }
  }, [open, habit]);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      setError("Give your habit a name with at least 2 characters.");
      return;
    }
    if (form.frequency !== "daily" && !form.weekdays.length) {
      setError("Choose at least one day.");
      return;
    }
    saveHabit(
      {
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        archived: habit?.archived || false,
      },
      habit?.id,
    );
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={habit ? "Edit habit" : "Create a new habit"}
    >
      <form className="habit-form" onSubmit={submit}>
        <p className="modal-subtitle">
          Make it small enough to start, meaningful enough to repeat.
        </p>
        <Field
          label="Habit name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Read for 10 minutes"
          autoFocus
          maxLength={70}
        />
        <label className="field">
          <span className="field-label">
            Description <small>Optional</small>
          </span>
          <textarea
            className="input textarea"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="A little context for future you…"
            rows="2"
            maxLength={180}
          />
        </label>
        <div className="form-row">
          <label className="field">
            <span className="field-label">Category</span>
            <select
              className="input"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Frequency</span>
            <select
              className="input"
              value={form.frequency}
              onChange={(e) => set("frequency", e.target.value)}
            >
              <option value="daily">Every day</option>
              <option value="weekly">Selected days</option>
            </select>
          </label>
        </div>
        {form.frequency === "weekly" && (
          <div className="field">
            <span className="field-label">Repeat on</span>
            <div className="weekday-picker">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <button
                  type="button"
                  key={i}
                  aria-pressed={form.weekdays.includes(i)}
                  className={form.weekdays.includes(i) ? "selected" : ""}
                  onClick={() =>
                    set(
                      "weekdays",
                      form.weekdays.includes(i)
                        ? form.weekdays.filter((x) => x !== i)
                        : [...form.weekdays, i],
                    )
                  }
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="field">
          <span className="field-label">Choose an icon</span>
          <div className="icon-picker">
            {ICONS.map(({ id, icon: Icon }) => (
              <button
                type="button"
                key={id}
                className={form.icon === id ? "selected" : ""}
                aria-label={`Use ${id} icon`}
                aria-pressed={form.icon === id}
                onClick={() => set("icon", id)}
              >
                <Icon size={17} />
              </button>
            ))}
          </div>
        </div>
        <Field
          label="Goal or target (optional)"
          value={form.goal}
          onChange={(e) => set("goal", e.target.value)}
          placeholder="e.g. 8 glasses, 20 pages"
          maxLength={80}
        />
        {error && <p className="inline-error">{error}</p>}
        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {habit ? "Save changes" : "Create habit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
