const TaskCard = ({
  task,
  columns,
  onEdit,
  onDelete,
  onMove,
}) => {
  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>

        <span className={`priority ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

      <div className="task-date">
        Created: {new Date(task.created_at).toLocaleString()}
      </div>

      <div className="task-actions">
        <button onClick={() => onEdit(task)}>
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>

      <div className="move-task">
        <label>Move:</label>

        <select
          value={task.column_id}
          onChange={(e) =>
            onMove(task.id, Number(e.target.value))
          }
        >
          {columns.map((column) => (
            <option key={column.id} value={column.id}>
              {column.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskCard;