# Realtime Quiz Platform

This is a full-stack Realtime Quiz Platform that allows administrators to create and manage quizzes in real time, with features like answer submission, leaderboards, and role-based UI.

## Project Structure

- `Backend/` – Node.js + Express server with Socket.IO
- `Frontend/` – React-based client (if available)
- `.env` – Store your environment variables (e.g., MongoDB URI, JWT secret)

---

## Backend Setup
First download NodeJS through this link-
https://nodejs.org/en/download

```bash
cd Backend
npm install
npm run dev
```

Make sure to create a `.env` file inside the `Backend/` folder with the following example content:

```
PORT=3000
MONGO_URI=YOUR_URL

CLOUDINARY_CLOUD_NAME=YOUR_NAME
CLOUDINARY_API_KEY=YOUR_KEY
CLOUDINARY_API_SECRET=YOUR_KEY


JWT_SECRET_KEY=interview_project_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d
```

## Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```


---

## Features

- Real-time question broadcasting with Socket.IO
- JWT-based authentication
- Admin and participant roles
- Answer submission and scoring
- Leaderboard and quiz history tracking

---

## Getting Started

1. Clone the repository
2. Run the backend
3. Run the frontend
4. Open the browser with the shown link

---


