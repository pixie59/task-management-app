# Task Management App

## Overview

Task Management App is a full-stack productivity application that helps users organize their work using boards and tasks. Users can create boards, manage tasks, track progress, and organize workflows through a modern Kanban-style interface.

The application includes secure authentication, board and task management, drag-and-drop functionality, search and sorting features, progress tracking, and dark mode support.

---

## Features

### Authentication

* User Signup
* User Login
* Password Hashing with bcrypt
* JWT Authentication
* Protected Routes
* Protected APIs

### Board Management

* Create Boards
* Edit Boards
* Delete Boards
* Board Descriptions
* User-specific Boards

### Task Management

* Create Tasks
* Edit Tasks
* Delete Tasks
* Task Descriptions
* Task Status Updates
* Task Organization by Board

### Productivity Features

* Drag and Drop Task Movement
* Search Tasks
* Sort Tasks
* Progress Tracking
* Task Statistics Dashboard
* Empty State Handling

### User Experience

* Dark Mode
* Responsive Layout
* Animated Modals
* Blur Background Effects
* Loading States
* Modern Dashboard UI

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* Framer Motion

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* JWT
* bcryptjs

---

## Screenshots

Screenshots and demo previews will be added soon.

---

## Installation

### Prerequisites

* Node.js
* PostgreSQL
* npm

### Clone Repository

```bash
git clone <repository-link>
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

Create a `.env` file inside the backend directory:

```env
DATABASE_URL="your_postgresql_connection_string"
```

Run:

```bash
npx prisma migrate dev
```

---

## Project Structure

```text
frontend/
├── src/
│   ├── entry/
│   ├── components/

backend/
├── prisma/
├── routes/
├── lib/
├── authMw.js
├── server.js
```

---

## Authentication Flow

```text
Signup
↓
Password Hashing (bcrypt)
↓
Store User in PostgreSQL
↓
Login
↓
JWT Generation
↓
Protected Routes
↓
Access Boards & Tasks
```

---

## Future Improvements

* Custom Delete Confirmation Modals
* Due Dates
* Team Collaboration
* Real-time Updates
* Notifications
* Cloud Deployment

---

## Author

Developed by Hitanshi Singhal as part of a Full-Stack Web Development Internship Project.

---

## Project Status

✅ Authentication Complete

✅ Board Management Complete

✅ Task Management Complete

✅ Drag & Drop Complete

✅ Search & Sorting Complete

✅ Dark Mode Complete

🚀 Currently being enhanced with deployment and additional productivity features.
