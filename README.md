# 🎓 CampusConnect

### Peer-to-Peer Campus Resource Exchange & Learning Platform

CampusConnect is a full-stack MERN-based campus platform designed to connect students, seniors, juniors, and faculty within a college community.

The platform provides a centralized space where users can share academic resources, notes, projects, recommendations, and queries while maintaining an admin-based approval and moderation system.

---

## 🌐 Live Demo

### 🚀 Frontend
https://campus-connect-c1tg-1n9pvs9dp-srishtishrivastava931-6103.vercel.app/

### ⚙️ Backend API
https://campusconnect-backend-0ms4.onrender.com

> The frontend is deployed on Vercel, while the backend is deployed on Render and connected to MongoDB Atlas.

---

# 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Problem Statement](#-problem-statement)
- [Objectives](#-objectives)
- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [Authentication System](#-authentication-system)
- [Core Modules](#-core-modules)
- [Admin System](#-admin-system)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Project Structure](#-project-structure)
- [API Overview](#-api-overview)
- [Database](#-database)
- [File Upload System](#-file-upload-system)
- [Notifications](#-notifications)
- [Search & Dashboard](#-search--dashboard)
- [Security](#-security)
- [Responsive Design](#-responsive-design)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Local Installation](#-local-installation)
- [Future Enhancements](#-future-enhancements)
- [Project Benefits](#-project-benefits)
- [Conclusion](#-conclusion)

---

# 📖 About the Project

CampusConnect is a college-focused peer-to-peer learning and resource-sharing platform.

In a typical college environment, students often depend on informal communication channels to exchange notes, previous projects, useful resources, recommendations, and academic help.

CampusConnect aims to organize this process into a single structured platform.

Students can:

- Share useful academic resources
- Upload notes
- Showcase academic projects
- Ask questions
- Reply to queries
- Share recommendations
- Explore resources shared by other students
- Manage their own activities
- Receive notifications

Faculty members can also participate through the platform, while administrators manage approval and moderation.

---

# ❗ Problem Statement

Students often face difficulty finding reliable academic resources within their campus.

Common problems include:

- Important notes being scattered across different platforms
- Difficulty finding useful senior projects
- Lack of a centralized resource-sharing platform
- Informal communication for academic queries
- Difficulty discovering useful recommendations
- No structured approval or moderation system
- Limited interaction between juniors and seniors

CampusConnect addresses these problems by providing a centralized and organized campus community platform.

---

# 🎯 Objectives

The main objectives of CampusConnect are:

1. Create a centralized campus resource-sharing platform.
2. Connect juniors and seniors through academic content.
3. Allow students to share useful resources and notes.
4. Provide a platform for showcasing projects.
5. Allow users to ask and resolve academic queries.
6. Provide recommendation sharing.
7. Implement role-based access and administration.
8. Maintain content quality through admin approval.
9. Provide notifications for important platform activities.
10. Create a responsive and user-friendly interface.

---

# ✨ Key Features

## 🔐 Authentication

- Student registration
- Faculty registration
- College email verification
- OTP verification
- JWT-based authentication
- Secure password hashing
- Login and logout
- Protected routes
- Role-based access control

---

## 👨‍🎓 Student Features

Students can:

- Register using their college email
- Verify their account using OTP
- Login securely
- View their dashboard
- Explore campus content
- Share resources
- Upload notes
- Share academic projects
- Ask queries
- Reply to queries
- Submit recommendations
- View notifications
- Manage their profile
- View their activity

---

## 👩‍🏫 Faculty Features

Faculty users can:

- Register using faculty credentials
- Verify their college email
- Login securely
- Access the platform based on their role
- Participate in the campus ecosystem
- Access authorized platform features

---

# 👑 Admin System

CampusConnect includes an administrative moderation system.

Administrators can:

- View pending users
- Approve users
- Reject users
- View pending resources
- Approve resources
- Reject resources
- View pending notes
- Approve notes
- Reject notes
- View pending projects
- Approve projects
- Reject projects
- Review recommendations
- Resolve recommendations
- Manage platform content

This approval system helps maintain the quality and reliability of shared content.

---

# 📚 Core Modules

## 1. Resources

Users can share useful resources with the campus community.

Resources can include:

- Books
- Notes
- Lab equipment
- Drafting tools
- Electronics
- Other academic resources

Users can also specify the resource type:

- Sell
- Rent
- Donate

Resources can optionally include uploaded files.

All newly submitted resources enter a pending state and require administrator approval before appearing publicly.

---

# 📝 2. Notes

Students can upload and share academic notes.

The notes system supports:

- Note creation
- File uploads
- Pending approval
- Admin approval
- Admin rejection
- Personal notes management
- Public approved notes

---

# 💻 3. Projects

Students can showcase their academic projects.

The project module supports:

- Project submission
- Project descriptions
- Project updates
- Project deletion
- Admin approval
- Admin rejection
- Public approved projects
- Personal project management

This allows students to build an academic project portfolio within the campus ecosystem.

---

# 💬 4. Queries

CampusConnect provides a query system where students can ask questions and seek help from other users.

Features include:

- Create queries
- View open queries
- Reply to queries
- View personal queries
- Resolve queries

This encourages peer-to-peer academic interaction.

---

# 💡 5. Recommendations

Users can submit recommendations related to campus life and academics.

The recommendation workflow includes:

```text
User submits recommendation
          ↓
Pending
          ↓
Admin review
          ↓
Reviewed / Resolved
