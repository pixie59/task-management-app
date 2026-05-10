# Task Management App

## Description

Task Management App is a collaborative web application designed to help users manage boards and tasks efficiently. The project focuses on implementing secure authentication, protected routes, and scalable backend architecture using modern full-stack technologies.

This project is being developed as part of an internship milestone-based workflow and currently includes authentication and protected dashboard functionality.


# Features

## Authentication Features

* User Signup
* User Login
* Password Hashing using bcrypt
* JWT Token Generation
* Protected Routes using Middleware
* Authentication Validation

## Backend Features

* Express.js API Routes
* PostgreSQL Database Integration
* Prisma ORM Queries
* Middleware-based Route Protection

## Upcoming Features

* Boards Management
* Task Management
* Drag and Drop Support
* Real-time Collaboration
* Dashboard Enhancements


# Tech Stack

## Frontend

* React
* Vite
* JavaScript

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL
* Prisma ORM

## Authentication

* JWT
* bcryptjs


# Visuals

Screenshots and UI previews will be added in future updates as the frontend dashboard and task management system are completed.


# Installation

## Requirements

* Node.js installed
* PostgreSQL installed locally
* npm package manager

## Clone Repository

```bash
git clone <repository-link>
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

## Database Setup

1. Create PostgreSQL database locally.
2. Configure DATABASE_URL in .env file.
3. Run Prisma migration:

```bash
npx prisma db push
```


# Usage

## Signup

Users can create an account using email and password.

## Login

Registered users can log in securely using JWT authentication.

## Protected Dashboard

Authenticated users can access protected dashboard routes using generated tokens.


# Project Structure

```bash
frontend/
backend/
 ├── prisma/
 ├── routes/
 ├── authMw.js
 ├── server.js
```


# Authentication Flow

```text
Signup
↓
Hash Password using bcrypt
↓
Store User in PostgreSQL
↓
Login
↓
Verify Password
↓
Generate JWT Token
↓
Verify Token using Middleware
↓
Access Protected Dashboard
```

# Roadmap

## Week 1

* Authentication System
* JWT Middleware
* Protected Dashboard

## Week 2

* Boards API
* Dashboard Integration
* Board Management

## Future Goals

* Drag and Drop Tasks
* Real-time Features
* Team Collaboration
* Deployment


# Contributing

This project is currently being developed as part of an internship program. Contributions and suggestions for improvements are welcome.



# Author and Acknowledgment

Developed by Hitanshi Singhal as part of a full-stack web development internship project.


# Project Status

Project is currently under active development. Authentication system and backend protection have been completed successfully, and board/task management features are currently in progress.
