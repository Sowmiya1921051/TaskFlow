# TaskFlow — Full-Stack Task Management Board

A lightweight full-stack task management application built with React, Node.js, Express, and SQLite.

TaskFlow provides a simple Kanban-style board where users can create, edit, delete, filter, and move tasks between workflow columns. All task data is persisted in a relational SQLite database through a RESTful backend API.

---

## Overview

TaskFlow was developed as a full-stack take-home assignment with a focus on:

- Clean and maintainable code structure
- REST API design
- Relational database design
- Server-side validation
- Persistent data storage
- Error handling
- Automated backend testing
- Simple and responsive user interface

The application intentionally avoids unnecessary features and focuses on delivering a reliable implementation of the core requirements.

---

## Features

### Task Management

- Create a task
- Edit an existing task
- Delete a task
- View tasks by board column
- Move tasks between columns
- Set task priority
- Store task creation date

### Filtering

Tasks can be filtered by:

- All
- High priority
- Medium priority
- Low priority

### Validation

- Task title is required
- Empty task titles are rejected on the frontend
- Empty task titles are also rejected by the backend
- Invalid column references are rejected
- API errors are handled and displayed to the user

### Database

- SQLite relational database
- Foreign key relationships
- Primary keys
- Required fields using `NOT NULL`
- Database schema included in the repository
- Seed data included for easy setup

### Testing

Backend tests cover:

- Creating a task without a title
- Moving a task between columns
- Database query behavior

---

# Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Frontend development/build tool |
| Tailwind CSS | Styling |
| Axios | HTTP/API communication |
| JavaScript | Application logic |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API |
| SQLite | Relational database |
| better-sqlite3 | SQLite database access |

## Testing & Development

| Tool | Purpose |
|---|---|
| Postman | API testing |
| Git | Version control |
| GitHub | Source code hosting |
| VS Code | Development environment |


## Project Resources

- **GitHub Repository:** [TaskFlow Board](https://github.com/Sowmiya1921051/TaskFlow)
- **Google Drive:** [View Project Files / Demo]([YOUR_GOOGLE_DRIVE_LINK](https://drive.google.com/file/d/1PtFCFsa-VYE59VCTfLVFmxj0mZGvW1Ly/view?usp=drive_link))

---

# Architecture

The application follows a simple client-server architecture:

```text
┌─────────────────────────────┐
│          React UI           │
│       Tailwind CSS          │
└──────────────┬──────────────┘
               │
               │ HTTP / REST API
               ▼
┌─────────────────────────────┐
│       Node.js + Express     │
│         REST API            │
└──────────────┬──────────────┘
               │
               │ SQL
               ▼
┌─────────────────────────────┐
│           SQLite            │
│                             │
│   Boards → Columns → Tasks  │
└─────────────────────────────┘



