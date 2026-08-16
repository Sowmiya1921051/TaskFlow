const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dataDirectory = path.join(__dirname, "../../data");

if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
}

const dbPath = path.join(dataDirectory, "taskflow.db");

console.log("Database path:", dbPath);

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

const schemaPath = path.join(__dirname, "schema.sql");

const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema);

console.log("Database initialized successfully.");

module.exports = db;