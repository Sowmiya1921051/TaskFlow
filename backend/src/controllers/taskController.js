const db = require("../database/database");

function getBoard(req, res) {
    try {
        const boardId = Number(req.params.boardId);

        const board = db
            .prepare(`
                SELECT id, name
                FROM boards
                WHERE id = ?
            `)
            .get(boardId);

        if (!board) {
            return res.status(404).json({
                message: "Board not found"
            });
        }

        const columns = db
            .prepare(`
                SELECT
                    id,
                    name
                FROM columns
                WHERE board_id = ?
                ORDER BY id
            `)
            .all(boardId);

        const tasks = db
            .prepare(`
                SELECT
                    id,
                    column_id,
                    title,
                    description,
                    priority,
                    created_at
                FROM tasks
                WHERE column_id IN (
                    SELECT id
                    FROM columns
                    WHERE board_id = ?
                )
                ORDER BY created_at DESC
            `)
            .all(boardId);

        const result = {
            ...board,
            columns: columns.map((column) => ({
                ...column,
                tasks: tasks.filter(
                    (task) => task.column_id === column.id
                )
            }))
        };

        res.json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to load board"
        });
    }
}

function createTask(req, res) {
    try {
        const {
            title,
            description = null,
            priority = "Medium",
            columnId
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const validPriorities = ["Low", "Medium", "High"];

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Priority must be Low, Medium, or High"
            });
        }

        if (!columnId) {
            return res.status(400).json({
                message: "Column ID is required"
            });
        }

        const column = db
            .prepare(`
                SELECT id
                FROM columns
                WHERE id = ?
            `)
            .get(columnId);

        if (!column) {
            return res.status(404).json({
                message: "Column not found"
            });
        }

        const result = db
            .prepare(`
                INSERT INTO tasks
                (column_id, title, description, priority)
                VALUES (?, ?, ?, ?)
            `)
            .run(
                columnId,
                title.trim(),
                description,
                priority
            );

        const task = db
            .prepare(`
                SELECT *
                FROM tasks
                WHERE id = ?
            `)
            .get(result.lastInsertRowid);

        res.status(201).json(task);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create task"
        });
    }
}

function updateTask(req, res) {
    try {
        const taskId = Number(req.params.id);

        const {
            title,
            description = null,
            priority
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const validPriorities = ["Low", "Medium", "High"];

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Invalid priority"
            });
        }

        const existingTask = db
            .prepare(`
                SELECT id
                FROM tasks
                WHERE id = ?
            `)
            .get(taskId);

        if (!existingTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        db.prepare(`
            UPDATE tasks
            SET
                title = ?,
                description = ?,
                priority = ?
            WHERE id = ?
        `).run(
            title.trim(),
            description,
            priority,
            taskId
        );

        const updatedTask = db
            .prepare(`
                SELECT *
                FROM tasks
                WHERE id = ?
            `)
            .get(taskId);

        res.json(updatedTask);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update task"
        });
    }
}

function deleteTask(req, res) {
    try {
        const taskId = Number(req.params.id);

        const result = db
            .prepare(`
                DELETE FROM tasks
                WHERE id = ?
            `)
            .run(taskId);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete task"
        });
    }
}

function moveTask(req, res) {
    try {
        const taskId = Number(req.params.id);
        const { columnId } = req.body;

        if (!columnId) {
            return res.status(400).json({
                message: "Column ID is required"
            });
        }

        const task = db
            .prepare(`
                SELECT id
                FROM tasks
                WHERE id = ?
            `)
            .get(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const column = db
            .prepare(`
                SELECT id
                FROM columns
                WHERE id = ?
            `)
            .get(columnId);

        if (!column) {
            return res.status(404).json({
                message: "Column not found"
            });
        }

        db.prepare(`
            UPDATE tasks
            SET column_id = ?
            WHERE id = ?
        `).run(columnId, taskId);

        const updatedTask = db
            .prepare(`
                SELECT *
                FROM tasks
                WHERE id = ?
            `)
            .get(taskId);

        res.json(updatedTask);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to move task"
        });
    }
}

function getTasksByPriority(req, res) {
    try {
        const { priority } = req.query;

        const validPriorities = ["Low", "Medium", "High"];

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Invalid priority"
            });
        }

        const tasks = db
            .prepare(`
                SELECT
                    id,
                    column_id,
                    title,
                    description,
                    priority,
                    created_at
                FROM tasks
                WHERE priority = ?
                ORDER BY created_at DESC
            `)
            .all(priority);

        res.json(tasks);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
}

function getTaskCountPerColumn(req, res) {
    try {
        const boardId = Number(req.params.boardId);

        const results = db
            .prepare(`
                SELECT
                    c.id,
                    c.name,
                    COUNT(t.id) AS task_count
                FROM columns c
                LEFT JOIN tasks t
                    ON t.column_id = c.id
                WHERE c.board_id = ?
                GROUP BY c.id, c.name
                ORDER BY c.id
            `)
            .all(boardId);

        res.json(results);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to calculate task counts"
        });
    }
}

module.exports = {
    getBoard,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByPriority,
    getTaskCountPerColumn
};