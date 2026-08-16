require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./database/database");

const taskRoutes = require("./routes/taskRoutes");
const boardRoutes = require("./routes/boardRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "TaskFlow API is running"
    });
});

app.use("/api/tasks", taskRoutes);

app.use("/api/boards", boardRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).json({
        message: "Internal server error"
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`TaskFlow API running on http://localhost:${PORT}`);
    });
}

module.exports = app;