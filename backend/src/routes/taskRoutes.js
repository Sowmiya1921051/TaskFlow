const express = require("express");

const {
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByPriority,
    getTaskCountPerColumn
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", createTask);

router.get("/priority", getTasksByPriority);

router.get(
    "/board/:boardId/counts",
    getTaskCountPerColumn
);

router.put("/:id", updateTask);

router.patch("/:id/move", moveTask);

router.delete("/:id", deleteTask);

module.exports = router;