# DevOps Task Tracker - https://tasktracker.anjayasystems.com/

A full-stack **Task Management & Testing Workflow System** built to solve real-world issues in software teams where task tracking, unit testing visibility, and QA validation are often poorly managed.

This platform helps organizations streamline the complete development lifecycle by ensuring every task moves through proper development, unit testing, and tester validation before completion.

---

## Problem Statement

In many companies:

- Tasks are tracked manually in Excel sheets
- Developers mark tasks as completed without proper unit testing proof
- Testers lack visibility into development progress
- Managers struggle to track team performance
- Task accountability is often unclear

This project solves these problems by introducing a structured workflow where every task is properly assigned, tested, validated, and documented.

---

## Core Features

### Authentication & Company Onboarding
- Admin registration
- Company workspace creation during signup
- Secure login/logout
- Role-based authentication

---

## User Management
Admin can create and manage:

- Developers
- Testers
- Team Leads
- Managers

---

## Task Management
- Create tasks
- Assign developers
- Assign testers
- Set deadlines
- Track task priorities
- Manage task lifecycle

---

## Developer Workflow
Developers can:

- View assigned tasks
- Update task progress
- Submit development notes
- Perform unit testing
- Upload unit testing proof/details

---

## Tester Workflow
Testers can:

- View testing queue
- Validate completed development tasks
- Approves tasks
- Reject tasks with bug comments

---

## Role-Based Dashboards

### Admin
- Manage users
- View overall company data

### Manager
- View reports
- Monitor performance
- Assign tasks

### Team Lead
- Assign tasks
- Track team progress

### Developer
- Manage assigned work
- Submit unit testing

### Tester
- Validate completed tasks

---

## Task Lifecycle Flow

```bash
Admin Signup
↓
Create Team Members
↓
Task Creation
↓
Developer Implementation
↓
Developer Unit Testing
↓
Tester Validation
↓
Task Completion
```

---

## Task Status Flow

```bash
Not Started
→ In Progress
→ Dev Done
→ Testing
→ Completed
```

If rejected:

```bash
Testing
→ Back to In Progress
```

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- React Hook Form
- TanStack Table
- Axios

---

### Backend
- .NET Core Web API
- Entity Framework Core
- JWT Authentication

---

### Database
- MySQL / SQL Server

---

## Future Enhancements

- Email notifications
- Deadline reminders
- File attachments
- Comments system
- Advanced analytics
- SaaS subscription model
- Mobile app support

---

## Why This Project?

This project was inspired by real problems faced in software teams where task tracking and testing workflows were poorly managed.

It demonstrates:

- Real-world system design
- Role-based architecture
- Multi-user workflow management
- Full-stack development
- Product thinking
- Business problem solving

---

## Project Goal

Build a scalable system that improves:

- Accountability
- Code quality
- Testing visibility
- Team productivity
- Task transparency

---

## Author

**Dhananjay**

Built as both:

- A real-world portfolio project
- A potential SaaS product for software teams
