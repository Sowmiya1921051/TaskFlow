import TaskCard from "./TaskCard";

const Column = ({
  column,
  columns,
  onEdit,
  onDelete,
  onMove,
}) => {
  return (
    <div className="flex min-h-[500px] flex-col rounded-2xl border border-slate-200 bg-slate-100 p-4">
      
      {/* Column header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-slate-800">
            {column.name}
          </h2>

          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 shadow-sm">
            {column.tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1">
        {column.tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 p-8 text-center text-sm text-slate-400">
            No tasks
          </div>
        ) : (
          column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columns={columns}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Column;