# Sanyug – Real-Time Chat Application

Sanyug is a real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO for real-time communication. It allows users to chat one-to-one with features like typing indicators, online/offline status, last seen, message persistence, notifications, and media sharing. Group chat functionality is upcoming.

---

## Features

- Real-time one-to-one chat with `typing indicators`, `online` status, and `last seen` tracking.
- `Media sharing` using Cloudinary (images and files).
- Persistent messages stored in `MongoDB`.
- `Real-time notifications` for new messages.
- Search filters to quickly find conversations and messages.
- Modular architecture with reusable React components and `Redux` for state management.
- Upcoming: Group chat functionality.

---

## Tech Stack

- **Frontend:** React, Redux, Tailwind CSS
- **Backend:** Node.js, Express.js, Socket.IO
- **Database:** MongoDB
- **Media Storage:** Cloudinary
- **Hosting / Deployment:** Frontend – Vercel, Backend – Render

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/sanyug.git
cd sanyug
```

### 2. Backend Setup
```bash
cd server
npm install
```

- Create a `.env` file in `server`:
```bash
PORT=5000               # optional for local development
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
FRONTEND_URL=http://localhost:3000   # or your deployed frontend URL
```
- Run the backend:
```bash
node start
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

- Run the frontend:
```bash
npm run dev
```

---

## Deployment Notes
- Backend must listen on `process.env.PORT` and `0.0.0.0` to work on Render.
- Frontend should connect to backend using `https://your-backend-domain.com` (Socket.IO will handle wss automatically).
- Ensure CORS is configured in Socket.IO for the frontend domain:

```bash 
const io = new Server(server, {
  cors: {
    origin: "https://your-frontend-domain.com",
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

--- 

## Socket.IO Usage

Client connection example:
```bash 
import { io } from "socket.io-client";

const authToken = localStorage.getItem("authToken");
const socket = io("https://sanyug-server.onrender.com", {
  transports: ["websocket"],
  auth: { token: authToken },
});
```

Client connection example:
```bash 
const io = new Server(server, {
  cors: { 
    origin: "https://sanyug-frontend.netlify.app", 
    methods: ["GET","POST"], 
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});
```

--- 

## Folder Structure
```bash
sanyug/
├── client/              # React frontend
│   ├── src/       
│      ├── assets/       
│      ├── components/   # dropdowns, sidebar, etc
│      ├── helpers/      # ProtectedRoutes 
│      ├── hooks/        # Resizable div
│      ├── pages/        # login, convesations, etc
│      ├── popups/       # delete message, add to chat, etc
│      ├── redux/        # chatSlice, userSlice, etc
│      ├── socket/       # socket logic
├── server/  
│   ├── config/          # DB connection
│   ├── controllers/     # API & socket logic
│   ├── middleware/      # authToken
│   ├── models/          # MongoDB schemas
│   ├── routes/          # REST APIs
└── README.md
```

--- 

## Future Enhancements

- Full group chat support
- Message reactions
- Typing animation improvements
- Push notifications for mobile browsers