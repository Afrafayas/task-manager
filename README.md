# TaskFlow — Task Management Application

A full-stack task management application built with React, NestJS, and MongoDB.

## 🚀 Live Demo
- Frontend: [Coming Soon]
- Backend API: [Coming Soon]

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Redux Toolkit
- Tailwind CSS
- React Hook Form + Zod
- React Router

### Backend
- NestJS + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Passport.js
- Class Validator

## ✨ Features
- JWT Authentication (Register/Login)
- Workspace Management (Create, Invite Members)
- Task Management (CRUD, Priority, Status)
- Task Assignment to Team Members
- Comments + Replies
- Kanban Board View
- Responsive UI (Mobile + Desktop)

## 📁 Project Structure

task-manager/
├── client/          # React Frontend
├── server/          # Express Backend (legacy)
└── server-nest/     # NestJS + TypeScript Backend

## 🔧 Setup & Installation

### Prerequisites
- Node.js
- MongoDB

### Backend (NestJS)
```bash
cd server-nest
npm install
npm run start:dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Environment Variables

**server-nest/.env**

PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret


**client/.env**

VITE_API_URL=http://localhost:5001/api

## 🔐 Demo Credentials
Email: afra@demo.com
Password: 123456


## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

### Workspace
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/workspace | Get workspaces |
| POST | /api/workspace | Create workspace |
| POST | /api/workspace/:id/invite | Invite member |
| DELETE | /api/workspace/:id/members/:userId | Remove member |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks/:taskId/comments | Get comments |
| POST | /api/tasks/:taskId/comments | Add comment |
| POST | /api/tasks/:taskId/comments/:commentId/replies | Add reply |
| DELETE | /api/tasks/:taskId/comments/:commentId | Delete comment |

## 👩‍💻 Author
**Afra NK**  
Full Stack Developer | React · NestJS · TypeScript · MongoDB

