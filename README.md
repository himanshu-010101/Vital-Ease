# Vital Ease

A full-stack MERN (MongoDB, Express, React, Node.js) application for healthcare partners to manage appointments, doctors, departments, and for users to browse, book, and manage their healthcare needs.

## Features

### Backend (Node.js/Express)
- User, Doctor, and Admin authentication (JWT, cookies)
- Manage appointments, doctors, departments, and services
- Role-based access (user/doctor/admin)
- MongoDB for data storage (Mongoose models)
- Cloudinary integration for media uploads

### Frontend (React + Vite)
- User, Doctor, and Admin registration/login
- Book, view, and manage appointments
- Admin dashboard for managing doctors, departments, and analytics
- Doctor dashboard for managing appointments and profile
- Responsive UI with Tailwind CSS

## Folder Structure

```
Vital Ease/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── pages/
│       ├── routes/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       └── assets/
│       └── services/
|       └── Dashboards/
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)
- Cloudinary account (for media uploads)

### Backend Setup

```
cd backend
npm install
```

Create a `.env` file with:
```
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:
```
npm run dev
```

### Frontend Setup

```
cd frontend
npm install
npm run dev
```

### Usage
- Visit [http://localhost:5173](http://localhost:5173) for the frontend.
- Backend runs on [http://localhost:5000](http://localhost:5000) by default.

## Scripts

### Backend
- `npm run dev` — Start backend with nodemon

### Frontend
- `npm run dev` — Start frontend dev server
- `npm run build` — Build frontend for production

## Environment Variables
See `.env.example` in the backend for required variables.

## License
MIT
