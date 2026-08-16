import { useEffect, useState } from "react";

import Column from "./Column";
import TaskModal from "./TaskModal";

import {
  getBoard,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} from "../services/api";

const TaskBoard = () => {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadBoard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBoard(1);

      setBoard(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load the task board."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, []);

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async (taskData) => {
    try {
      setError("");

      if (editingTask) {
        await updateTask(editingTask.id, {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
        });
      } else {
        await createTask(taskData);
      }

      setModalOpen(false);
      setEditingTask(null);

      await loadBoard();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save the task."
      );
    }
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteTask(taskId);

      await loadBoard();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete the task."
      );
    }
  };

  const handleMove = async (taskId, columnId) => {
    try {
      setError("");

      await moveTask(taskId, columnId);

      await loadBoard();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to move the task."
      );
    }
  };

  const getFilteredTasks = (tasks) => {
    if (filter === "All") {
      return tasks;
    }

    return tasks.filter(
      (task) => task.priority === filter
    );
  };

  if (loading) {
    return (
      <div className="loading">
        Loading TaskFlow...
      </div>
    );
  }

  if (!board) {
    return (
      <div className="error-page">
        {error || "Board not found."}
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>TaskFlow</h1>
          <p>Simple task management for small teams</p>
        </div>

        <button
          className="create-button"
          onClick={handleCreate}
        >
          + Create Task
        </button>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="toolbar">
        <div>
          <strong>Priority:</strong>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="board-title">
        <h2>{board.name}</h2>
      </div>

      <div className="board">
        {board.columns.map((column) => {
          const filteredColumn = {
            ...column,
            tasks: getFilteredTasks(column.tasks),
          };

          return (
            <Column
              key={column.id}
              column={filteredColumn}
              columns={board.columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMove={handleMove}
            />
          );
        })}
      </div>

      <TaskModal
        isOpen={modalOpen}
        task={editingTask}
        columns={board.columns}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TaskBoard;