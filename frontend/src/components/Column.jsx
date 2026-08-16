import TaskCard from "./TaskCard";

const Column = ({
  column,
  columns,
  onEdit,
  onDelete,
  onMove,
}) => {
  return (
    <div className="column">
      <div className="column-header">
        <h2>{column.name}</h2>

        <span className="task-count">
          {column.tasks.length}
        </span>
      </div>

      <div className="tasks">
        {column.tasks.length === 0 ? (
          <div className="empty-column">
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