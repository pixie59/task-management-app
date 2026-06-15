# Task Management App

A modern full-stack task management platform designed to help users organize projects, manage tasks efficiently, and track progress in real time.

Built with React, Express.js, PostgreSQL, Prisma ORM, JWT Authentication, Tailwind CSS, Socket.IO, and Drag-and-Drop functionality.

---

## Overview

Task Management App enables users to create project boards, organize tasks into different workflow stages, monitor project progress, and collaborate through real-time updates.

The application follows a Kanban-style workflow with dedicated Todo, Doing, and Done columns to provide a clear overview of project status.

---

## Key Features

### Authentication & Security

* Secure User Registration
* User Login System
* JWT-Based Authentication
* Protected API Routes
* User-Specific Data Access

### Project Boards

* Create Project Boards
* Edit Existing Boards
* Delete Boards
* View All Personal Boards

### Task Management

* Create Tasks
* Update Task Details
* Delete Tasks
* Move Tasks Across Workflow Stages
* Drag-and-Drop Task Management

### Analytics & Progress Tracking

* Total Tasks Counter
* In-Progress Tasks Counter
* Completed Tasks Counter
* Dynamic Progress Bar
* Project Completion Percentage

### User Experience

* Dark Mode Support
* Responsive Design
* Smooth Animations with Framer Motion
* Real-Time Updates Using Socket.IO
* Search Functionality
* Task Filtering
* Task Sorting

---

## Tech Stack

### Frontend

* React
* Tailwind CSS
* Framer Motion
* React Beautiful DnD
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Socket.IO

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/task-management-app.git
cd task-management-app
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL=your_database_url
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start the backend server:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on:

```text
http://localhost:3000
```

---

## Project Structure

```text
task-management-app
│
├── backend
│   ├── prisma
│   ├── routes
│   ├── middleware
│   ├── lib
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   ├── components
│   └── assets
│
└── README.md
```

---

## Future Enhancements

* Due Dates and Deadlines
* Team Collaboration
* Task Assignment
* Notifications System
* Activity Logs
* File Attachments
* User Profiles
* Cloud Deployment

---

## Learning Outcomes

This project helped strengthen understanding of:

* Full-Stack Application Development
* REST API Design
* Authentication and Authorization
* Database Modeling with Prisma
* Real-Time Communication using Socket.IO
* State Management in React
* Responsive UI Development
* Modern Web Development Practices

---

## Author

**Hitanshi Singhal**

Developed as part of a Full-Stack Web Development learning journey and portfolio project.
