# Task Manager — MERN Stack

A full-stack Kanban-style task management app built with MongoDB, Express, React, and Node.js.

## Features
- Add, edit, delete tasks
- Kanban board with 3 columns (Pending, In Progress, Completed)
- Priority levels (Low, Medium, High)
- Real-time status updates
- Professional UI with Tailwind CSS

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## Setup Instructions

### Backend
cd server
npm install
npm run dev

### Frontend
cd client
npm install
npm run dev

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/tasks | Get all tasks |
| POST   | /api/tasks | Create task |
| PUT    | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |