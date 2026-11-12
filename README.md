# Private Notes Manager

A secure, full-stack personal notes management application built with Node.js, Express, MongoDB, and Vanilla JavaScript. Features user authentication with JWT and bcrypt password hashing, ensuring strict user data isolation.

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens) and bcrypt password hashing (10 salt rounds).
- **Data Isolation**: Private workspace for each user—users can only view, create, and delete their own notes.
- **RESTful API**: Clean API endpoints for authentication and notes CRUD operations.
- **Single Page Application (SPA)**: Responsive vanilla HTML5, CSS3, and JavaScript frontend.
- **Secure Token Handling**: Bearer token authentication in HTTP Authorization headers.

## 📁 Project Structure

```
private-notes-manager/
├── config/
│   └── db.js                 # MongoDB connection logic
├── controllers/
│   ├── authController.js     # User registration & login logic
│   └── noteController.js     # Notes CRUD logic
├── middleware/
│   └── authMiddleware.js     # JWT verification middleware
├── models/
│   ├── User.js               # User schema with pre-save password hash
│   └── Note.js               # Note schema linked to User ObjectId
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   └── noteRoutes.js         # /api/notes routes (protected)
├── public/
│   ├── index.html            # SPA interface (Auth & Dashboard)
│   ├── style.css             # UI styling
│   └── app.js                # Frontend API integration & DOM logic
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
└── server.js                 # Express server entry point
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Security**: bcryptjs, jsonwebtoken, dotenv
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Fetch API)

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd <REPOSITORY_FOLDER>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Configure your variables:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/private_notes_db
   JWT_SECRET=your_long_random_jwt_secret_key
   PORT=5000
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running locally or provide a MongoDB Atlas connection string in `.env`.

5. **Run the Application:**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Or standard node
   npm start
   ```

6. Open your browser at `http://localhost:5000`.

## 🔒 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/notes` | Get all notes for authenticated user | Yes (`Bearer <token>`) |
| `POST` | `/api/notes` | Create a new note | Yes (`Bearer <token>`) |
| `DELETE` | `/api/notes/:id` | Delete a note by ID | Yes (`Bearer <token>`) |

## 📄 License
MIT

