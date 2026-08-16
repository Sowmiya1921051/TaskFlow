const TaskCard = ({
  task,
  columns,
  onEdit,
  onDelete,
  onMove,
}) => {
  const priorityStyles = {
    High: "bg-red-50 text-red-700 border-red-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="mb-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      
      {/* Task header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-800">
          {task.title}
        </h3>

        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
            priorityStyles[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {task.description}
        </p>
      )}

      {/* Date */}
      <p className="mt-3 text-xs text-slate-400">
        Created{" "}
        {new Date(task.created_at).toLocaleDateString()}
      </p>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      {/* Move */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500">
          Move:
        </span>

        <select
          value={task.column_id}
          onChange={(e) =>
            onMove(task.id, Number(e.target.value))
          }
          className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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