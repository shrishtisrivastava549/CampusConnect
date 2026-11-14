# 🎓 CampusConnect
### Peer-to-Peer Campus Resource Exchange & Learning Platform

CampusConnect is a full-stack MERN-based web application designed to connect students, seniors, juniors, and faculty members within a college community.

It provides a centralized platform where users can share academic resources, upload notes, showcase projects, ask questions, exchange answers, and discover useful recommendations.

## 🌐 Live Demo

- **Frontend:** https://campus-connect-c1tg-1n9pvs9dp-srishtishrivastava931-6103.vercel.app/
- **Backend:** https://campusconnect-backend-0ms4.onrender.com

## ✨ Key Features

### 🔐 Authentication
- Student and faculty registration
- Email OTP verification
- Secure login and logout
- JWT-based authentication
- Role-based access control

### 📚 Resources
- Share academic and educational resources
- Sell, rent, or donate resources
- Admin approval system
- Manage uploaded resources

### 📝 Notes
- Upload and share academic notes
- PDF file support
- Admin approval and moderation
- Personal notes management

### 💻 Projects
- Showcase academic projects
- Add project descriptions and links
- Admin approval system
- Manage and delete uploaded projects

### 💬 Questions & Answers
- Ask academic questions
- Reply to questions posted by other students
- Admin participation
- Resolve questions

### 💡 Recommendations
- Share useful courses, skills, projects, and learning resources
- Add descriptions and useful links
- Helpful voting
- Admin moderation

### 🔎 Explore
- Search for projects, notes, and resources
- Find relevant academic content
- Browse available campus resources

### 👑 Admin Dashboard
- Manage users
- Approve or reject submissions
- Moderate platform content
- Manage uploaded materials

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| JavaScript | Application logic |
| Node.js | Backend runtime |
| Express.js | Backend API |
| MongoDB | Database |
| Mongoose | Database management |
| JWT | Authentication |
| bcrypt | Password security |
| Nodemailer | Email OTP |
| Multer | File uploads |
| Postman | API testing |
| Git & GitHub | Version control |
| Vercel | Frontend deployment |
| Render | Backend deployment |

## 📁 Project Structure

```text
CampusConnect/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── assets/
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/shrishtisrivastava549/CampusConnect.git
cd CampusConnect
```

### 2. Backend setup

```bash
cd backend
npm install
npm start
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Variables

Configure the required environment variables in your local `.env` files.

Backend variables may include:

```env
PORT=
MONGO_URI=
JWT_SECRET=
MAIL_USER=
MAIL_PASS=
UPLOADS_DIR=
```

Frontend:

```env
VITE_API_URL=
```

Never upload actual passwords, API secrets, or private credentials to GitHub.

## 🚀 Deployment

- Frontend hosted on Vercel.
- Backend hosted on Render.
- MongoDB Atlas used for cloud database hosting.
- Persistent file storage is required for uploaded files in production.

## 🎯 Project Objective

The main objective of CampusConnect is to create a collaborative academic environment where students can easily exchange educational resources, share knowledge, seek academic assistance, and connect with their college community.

## 🔮 Future Enhancements

- Improved real-time notifications
- Advanced search and filtering
- Better resource recommendations
- Enhanced user dashboard
- Additional collaboration features

## 👩‍💻 Developed By

**CampusConnect Project Team**

A student-focused platform built to improve academic collaboration and resource sharing.

---

⭐ If you find this project useful, consider giving the repository a star!
