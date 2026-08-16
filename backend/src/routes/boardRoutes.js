const express = require("express");

const {
    getBoard
} = require("../controllers/taskController");

const router = express.Router();

router.get("/:boardId", getBoard);

module.exports = router;