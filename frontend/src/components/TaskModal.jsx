import { useEffect, useState } from "react";

const TaskModal = ({
  isOpen,
  task,
  columns,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [columnId, setColumnId] = useState(1);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setColumnId(task.column_id);
    } else {
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setColumnId(columns[0]?.id || 1);
    }
  }, [task, columns, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      columnId: Number(columnId),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{task ? "Edit Task" : "Create Task"}</h2>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Title *
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />

          <label>
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows="4"
          />

          <label>
            Priority
          </label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {!task && (
            <>
              <label>
                Column
              </label>

              <select
                value={columnId}
                onChange={(e) =>
                  setColumnId(e.target.value)
                }
              >
                {columns.map((column) => (
                  <option
                    key={column.id}
                    value={column.id}
                  >
                    {column.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>

            <button type="submit" className="save-button">
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;