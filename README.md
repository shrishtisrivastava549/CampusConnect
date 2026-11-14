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

---

## 📌 Table of Contents

- About the Project
- Problem Statement
- Objectives
- Key Features
- User Roles
- Authentication System
- Core Modules
- Admin System
- Technology Stack
- Project Architecture
- Project Structure
- API Overview
- Database
- File Upload System
- Notifications
- Search & Dashboard
- Security
- Responsive Design
- Deployment
- Environment Variables
- Local Installation
- Future Enhancements
- Project Benefits
- Conclusion

---

# 📖 About the Project

CampusConnect is a college-focused peer-to-peer learning and resource-sharing platform.

Students can:
- Share useful academic resources.
- Upload notes.
- Showcase academic projects.
- Ask questions.
- Reply to queries.
- Share recommendations.
- Explore resources shared by other students.
- Manage their activities.
- Receive notifications.

Faculty members can also participate through the platform, while administrators manage approval and moderation.

---

# ❗ Problem Statement

Students often face difficulty finding reliable academic resources within their campus.

Common problems include:

- Important notes being scattered across different platforms.
- Difficulty finding useful senior projects.
- Lack of a centralized resource-sharing platform.
- Informal communication for academic queries.
- Difficulty discovering useful recommendations.
- No structured approval or moderation system.
- Limited interaction between juniors and seniors.

CampusConnect addresses these problems by providing a centralized and organized campus community platform.

---

# 🎯 Objectives

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

- Student registration.
- Faculty registration.
- College email verification.
- OTP verification.
- JWT-based authentication.
- Secure password hashing.
- Login and logout.
- Protected routes.
- Role-based access control.

## 👨‍🎓 Student Features

- Register using college email.
- Verify account using OTP.
- Login securely.
- View dashboard.
- Explore campus content.
- Share resources.
- Upload notes.
- Share academic projects.
- Ask and reply to queries.
- Submit recommendations.
- View notifications.
- Manage profile.
- View personal activity.

## 👩‍🏫 Faculty Features

- Faculty registration.
- Faculty ID and department association.
- Email verification.
- Admin approval.
- Department-restricted student directory.
- Access authorized platform features.

## 👑 Admin Features

- View all registered students and faculty.
- Approve or reject registrations.
- Manage student and faculty accounts.
- View pending resources, notes and projects.
- Approve or reject submitted content.
- Review recommendations.
- Resolve campus-level issues.
- Access all departments.
- Manage platform information.

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

Resource types:

- Sell
- Rent
- Donate

Newly submitted resources enter a pending state and require administrator approval before appearing publicly.

## 2. Notes

Students can upload and share academic notes.

Features:

- Note creation.
- File uploads.
- Pending approval.
- Admin approval and rejection.
- Personal notes management.
- Public approved notes.

## 3. Projects

Students can showcase academic projects.

Features:

- Project submission.
- Project descriptions.
- Project updates.
- Project deletion.
- Admin approval and rejection.
- Public approved projects.
- Personal project management.

## 4. Queries

CampusConnect provides a query system where students can ask questions and seek help.

Features:

- Create queries.
- View open queries.
- Reply to queries.
- View personal queries.
- Resolve queries.

## 5. Recommendations

Users can submit recommendations related to campus life and academics.

Workflow:

User submits recommendation → Pending → Admin review → Reviewed / Resolved.

---

# 🔐 Role-Based Authentication and Account Approval

CampusConnect supports three account types:

- Student
- Faculty
- Admin

Each account has separate login access.

The selected login role must match the role stored in MongoDB.

Public registration is available only for Students and Faculty. Admin accounts cannot be created through public signup.

## Automatic College Email Detection

The official college email domain is:

`@rkgit.com`

Registration rules:

- Students registering with `@rkgit.com` can receive automatic account approval after successful OTP verification.
- Students using Gmail, Outlook, Yahoo or other personal email addresses must wait for Admin approval after email verification.
- Faculty accounts require Admin approval.
- Pending and rejected accounts cannot access protected dashboards or APIs.

Email-domain detection alone is not considered proof of mailbox ownership.

## Course and Department Selection

Available courses:

- B.Tech
- MCA
- MBA
- BBA
- BCA

Department selection changes dynamically according to the selected course.

B.Tech departments:
- CSE
- IT
- ECE
- Electrical Engineering
- Mechanical Engineering
- Civil Engineering
- AI & ML
- Data Science

MCA, MBA, BBA and BCA have their respective course departments.

## Academic Year and Semester Selection

| Course | Duration | Semesters |
|---|---|---|
| B.Tech | 4 Years | 8 |
| MCA | 2 Years | 4 |
| MBA | 2 Years | 4 |
| BBA | 3 Years | 6 |
| BCA | 3 Years | 6 |

Semester options depend on the selected academic year.

- First Year: Semester 1 and 2.
- Second Year: Semester 3 and 4.
- Third Year: Semester 5 and 6.
- Fourth Year: Semester 7 and 8.

Backend validation prevents invalid course, department, year and semester combinations.

---

# 👨‍🏫 Faculty Department Access

Every Faculty account is associated with a specific department.

Faculty can access only approved students belonging to their assigned department.

Examples:

- CSE Faculty → CSE students.
- MCA Faculty → MCA students.
- MBA Faculty → MBA students.
- BBA Faculty → BBA students.

Department restrictions are enforced through backend authorization and database queries.

---

# 👑 Admin Approval Management

The Admin dashboard includes a dedicated approval management system.

Admin can:

- View pending student registrations.
- View pending faculty registrations.
- Approve registrations.
- Reject registrations.
- View all approved students.
- View all faculty members.
- Access complete academic details.
- Manage accounts across departments.

Only pending accounts appear in the approval list.

Approved accounts become active, while rejected accounts cannot access protected features.

---

# 📋 Student Directory

The Student Directory is available to Admin and Faculty.

Admin can view:
- All approved students.
- All courses and departments.
- Student name.
- Email.
- Phone number.
- Course.
- Department.
- Academic year.
- Semester.

Faculty can view only approved students from their assigned department.

Search supports:
- Student name.
- Course.
- Department.
- Email.

The backend determines the logged-in user's role and department from the authenticated account.

---

# 👤 Profile Management

Students, Faculty and Admin can update their profiles.

Features:

- Change profile picture.
- Change name.
- Change email address.
- Change phone number.

Supported profile picture formats:

- JPG
- PNG
- WebP

Maximum profile picture size: 2 MB.

Email addresses must be unique.

Users cannot modify their own role, Admin permissions, approval status or protected department assignments through the normal profile update API.

The College Name field has been removed from the Profile page and Edit Profile form.

Changing an email address resets OTP verification and requires re-verification. Personal-email Students and Faculty also require Admin approval.

---

# 🛠 Technology Stack

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Vite

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- Nodemailer

### Database
- MongoDB
- Mongoose

### Deployment
- Vercel
- Render
- MongoDB Atlas

---

# 🔒 Security

CampusConnect implements:

- JWT-based authentication.
- Password hashing.
- Backend role-based authorization.
- Department-level access restrictions.
- Protected API routes.
- Email verification.
- Admin approval workflow.
- Input validation.
- Secure profile updates.
- File type and size validation.

Frontend role information and localStorage values are not trusted for backend authorization.

---

# ☁️ Deployment

CampusConnect uses:

- **Vercel:** Frontend hosting.
- **Render:** Backend hosting.
- **MongoDB Atlas:** Cloud database.

## Render Persistent File Storage

Uploaded note/resource PDFs and profile images must use persistent storage if they need to survive Render restarts and redeployments.

For the Render backend service:

1. Open the Render dashboard.
2. Add a Persistent Disk.
3. Set the mount path to `/var/data`.
4. Add the environment variable `UPLOADS_DIR=/var/data`.
5. Save and redeploy the backend.

Existing files stored only on the old temporary filesystem may need to be uploaded again or migrated to the persistent disk.

## Frontend Deployment on Vercel

Set the environment variable:

`VITE_API_URL`

Example:

`https://your-backend.onrender.com/api`

Redeploy the frontend after changing this variable.

---

# ⚙️ Environment Variables

Configure the following variables in the Render backend environment.

| Variable | Required | Purpose |
|---|---|---|
| MONGO_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | Secret used to sign JWT tokens |
| MAIL_USER | For OTP email | SMTP sender email |
| MAIL_PASS | For OTP email | Gmail App Password or provider credential |
| UPLOADS_DIR | Optional | Persistent upload directory |
| PORT | Optional | Server port |
| ADMIN_EMAIL | Admin setup scripts | Admin email |
| ADMIN_PASSWORD | Admin setup scripts | Admin password |
| FACULTY_EMAIL | Faculty reset script | Faculty email |
| FACULTY_PASSWORD | Faculty reset script | New faculty password |

Never commit `.env` files or credentials to GitHub.

## Signup OTP Email Configuration

The backend uses Gmail SMTP through Nodemailer.

Set:

- `MAIL_USER`: Gmail address used to send OTP emails.
- `MAIL_PASS`: Google App Password, not the normal Gmail password.

Google App Passwords require 2-Step Verification.

If either variable is missing, the backend returns a configuration error instead of pretending an OTP was sent.

After deployment, test signup and check Inbox and Spam/Junk.

---

# 🖥 Local Installation

## 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd CampusConnect
```

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
MAIL_USER=your_email
MAIL_PASS=your_app_password
PORT=5000
```

## 3. Start Backend

```bash
npm start
```

## 4. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Create a frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## 5. Start Frontend

```bash
npm run dev
```

The application will be available at the local Vite development URL.

---

# 🔑 Admin Account Setup

Admin accounts cannot be created through public signup.

Use the existing backend scripts after configuring:

- `MONGO_URI`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Run from the backend directory:

```bash
node createAdmin.js
```

To reset an existing Admin password:

```bash
node resetAdmin.js
```

Use a unique Admin password of at least 12 characters and keep credentials private.

---

# 📁 File Upload System

The profile endpoint accepts multipart form data:

`PUT /api/auth/profile`

Optional upload field:

`profilePicture`

Supported formats:

- JPEG
- PNG
- WebP

Maximum size: 2 MB.

Uploaded profile pictures are served from:

`/uploads/profiles/`

For Render deployments, configure `UPLOADS_DIR` to use persistent storage.

---

# 🚀 Future Enhancements

Potential future improvements include:

- Advanced search and filtering.
- Real-time chat.
- AI-powered resource recommendations.
- Improved analytics dashboard.
- Advanced notification system.
- Mobile application.
- More academic collaboration tools.

---

# 🎓 Project Benefits

CampusConnect provides:

- Centralized academic resource sharing.
- Better interaction between juniors and seniors.
- Organized academic content.
- Easier access to notes and projects.
- Structured academic query management.
- Secure role-based access.
- Department-wise student management.
- Centralized administration.

---

# ✅ Conclusion

CampusConnect aims to create a connected and organized college ecosystem where students and faculty can share academic resources, collaborate, ask questions and discover useful opportunities.

With role-based authentication, department-level access, account approval, academic profile management and centralized administration, the platform provides a structured environment for campus interaction and collaboration.

---

**Developed as a MERN Stack Project – CampusConnect**


