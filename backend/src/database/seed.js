const db = require("./database");

try {
    console.log("Starting database seed...");

    // Clear existing data
    db.prepare("DELETE FROM tasks").run();
    db.prepare("DELETE FROM columns").run();
    db.prepare("DELETE FROM boards").run();

    // Reset SQLite auto-increment counters
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'tasks'").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'columns'").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'boards'").run();

    // Create board
    const boardResult = db
        .prepare(`
            INSERT INTO boards (name)
            VALUES (?)
        `)
        .run("TaskFlow Demo Board");

    const boardId = Number(boardResult.lastInsertRowid);

    console.log("Created board:", boardId);

    // Create columns
    const insertColumn = db.prepare(`
        INSERT INTO columns (board_id, name)
        VALUES (?, ?)
    `);

    const todoResult = insertColumn.run(boardId, "To Do");
    const progressResult = insertColumn.run(boardId, "In Progress");
    const doneResult = insertColumn.run(boardId, "Done");

    const todoId = Number(todoResult.lastInsertRowid);
    const progressId = Number(progressResult.lastInsertRowid);
    const doneId = Number(doneResult.lastInsertRowid);

    console.log("Created columns:");
    console.log("To Do:", todoId);
    console.log("In Progress:", progressId);
    console.log("Done:", doneId);

    // Create tasks
    const insertTask = db.prepare(`
        INSERT INTO tasks
        (column_id, title, description, priority)
        VALUES (?, ?, ?, ?)
    `);

    insertTask.run(
        todoId,
        "Fix login bug",
        "Investigate authentication issue",
        "High"
    );

    insertTask.run(
        todoId,
        "Create dashboard",
        "Build the main dashboard UI",
        "Medium"
    );

    insertTask.run(
        progressId,
        "Build REST API",
        "Implement TaskFlow backend APIs",
        "High"
    );

    insertTask.run(
        progressId,
        "Create database",
        "Create SQLite database schema",
        "Medium"
    );

    insertTask.run(
        doneId,
        "Setup React project",
        "Initialize React using Vite",
        "Low"
    );

    console.log("Seed data inserted successfully!");

    // Verify board
    const board = db
        .prepare("SELECT * FROM boards")
        .all();

    const columns = db
        .prepare("SELECT * FROM columns")
        .all();

    const tasks = db
        .prepare("SELECT * FROM tasks")
        .all();

    console.log("\nBoards:");
    console.table(board);

    console.log("\nColumns:");
    console.table(columns);

    console.log("\nTasks:");
    console.table(tasks);

} catch (error) {
    console.error("SEED ERROR:");
    console.error(error);
} finally {
    db.close();
}