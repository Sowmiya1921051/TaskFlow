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

  // Load board from backend
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

  // Load board when component starts
  useEffect(() => {
    loadBoard();
  }, []);

  // Open create modal
  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // Create or update task
  const handleSubmit = async (taskData) => {
    try {
      setError("");

      if (editingTask) {
        // Update existing task
        await updateTask(editingTask.id, {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
        });
      } else {
        // Create new task
        await createTask({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          columnId: taskData.columnId,
        });
      }

      setModalOpen(false);
      setEditingTask(null);

      // Refresh board
      await loadBoard();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save the task."
      );
    }
  };

  // Delete task
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

  // Move task to another column
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

  // Filter tasks by priority
  const getFilteredTasks = (tasks) => {
    if (filter === "All") {
      return tasks;
    }

    return tasks.filter(
      (task) => task.priority === filter
    );
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

          <p className="text-sm font-medium text-slate-500">
            Loading TaskFlow...
          </p>
        </div>
      </div>
    );
  }

  // Error if board doesn't load
  if (!board) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-700">
            Unable to load board
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error || "Board not found."}
          </p>

          <button
            onClick={loadBoard}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo + Title */}
          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
                T
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                  TaskFlow
                </h1>
              </div>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Simple task management for small teams
            </p>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            + Create Task
          </button>

        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Error message */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">

            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              onClick={() => setError("")}
              className="text-sm font-semibold text-red-600 hover:text-red-800"
            >
              ×
            </button>

          </div>
        )}

        {/* Board heading + Filter */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          {/* Board name */}
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {board.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage and track your team's tasks
            </p>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-3">

            <label
              htmlFor="priority-filter"
              className="text-sm font-medium text-slate-600"
            >
              Priority
            </label>

            <select
              id="priority-filter"
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="All">
                All priorities
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>

          </div>

        </div>

        {/* ================= BOARD ================= */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

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

      </main>

      {/* ================= TASK MODAL ================= */}
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