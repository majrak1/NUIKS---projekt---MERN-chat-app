# MERN Chat App - Backend

Backend server for the MERN Chat Application, built with Express.js and Socket.IO for real-time messaging.

## Features

- User authentication (Signup/Login/Logout) with JWT
- Real-time messaging via Socket.IO
- User management and conversation tracking
- File upload and management
- AI Chatbot integration (Hugging Face)
- MongoDB database for persistence
- CORS enabled for frontend/mobile apps

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas connection)

## Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

## Environment Setup

Create a `.env` file in the backend directory with the following variables:

```env
PORT=2100
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### Generating JWT Secret

To generate a secure JWT secret:

```bash
openssl rand -base64 32
```

Use the output in your `.env` file.

## Running the Server

From the root directory:

```bash
npm run server
```

The server will start on `http://localhost:2100` by default.

The server uses **nodemon** for development, which automatically restarts the server when you make changes to the code.

## API Endpoints

### Authentication (`/api/auth`)

#### 1. Signup
- **Endpoint:** `POST /api/auth/signup`
- **Description:** Create a new user account
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "fullName": "John Doe",
    "username": "johndoe",
    "password": "securePassword123",
    "confirmPassword": "securePassword123",
    "gender": "male"
  }
  ```
- **Response (201):**
  ```json
  {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "username": "johndoe",
    "profilePic": "https://api.dicebear.com/9.x/pixel-art/png?seed=johndoe&hair=short01"
  }
  ```
- **Error Response (400):**
  ```json
  {
    "error": "Username already exists"
  }
  ```
  or
  ```json
  {
    "error": "Password and Confirm Password do not match"
  }
  ```

#### 2. Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate user and receive JWT token
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "password": "securePassword123"
  }
  ```
- **Response (200):**
  ```json
  {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "username": "johndoe",
    "profilePic": "https://api.dicebear.com/9.x/pixel-art/png?seed=johndoe&hair=short01"
  }
  ```
  - **Note:** JWT token is set in HTTP-only cookie automatically
- **Error Response (400):**
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

#### 3. Logout
- **Endpoint:** `POST /api/auth/logout`
- **Description:** Logout user and clear JWT token
- **Authentication:** Required
- **Request Body:** Empty
- **Response (200):**
  ```json
  {
    "message": "Logout successful"
  }
  ```

---

### Users (`/api/users`)

#### 1. Get Users for Sidebar
- **Endpoint:** `GET /api/users/`
- **Description:** Get list of all users except the current logged-in user
- **Authentication:** Required (JWT)
- **Request Body:** None
- **Response (200):**
  ```json
  [
    {
      "_id": "507f1f77bcf86cd799439012",
      "fullName": "Jane Smith",
      "username": "janesmith",
      "profilePic": "https://api.dicebear.com/9.x/pixel-art/png?seed=janesmith&hair=long01",
      "gender": "female"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "fullName": "Bob Johnson",
      "username": "bobjohnson",
      "profilePic": "https://api.dicebear.com/9.x/pixel-art/png?seed=bobjohnson&hair=short01",
      "gender": "male"
    }
  ]
  ```

---

### Messages (`/api/messages`)

#### 1. Send Message
- **Endpoint:** `POST /api/messages/send/:id`
- **Description:** Send a message to another user
- **Authentication:** Required (JWT)
- **URL Parameters:**
  - `id` (string): Recipient user ID
- **Request Body:**
  ```json
  {
    "message": "Hello! How are you?"
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "Message sent successfully",
    "newMessage": {
      "_id": "507f1f77bcf86cd799439014",
      "senderId": "507f1f77bcf86cd799439011",
      "receiverId": "507f1f77bcf86cd799439012",
      "message": "Hello! How are you?",
      "createdAt": "2024-01-17T10:30:00.000Z",
      "updatedAt": "2024-01-17T10:30:00.000Z"
    }
  }
  ```

#### 2. Get Messages
- **Endpoint:** `GET /api/messages/:id`
- **Description:** Get all messages in a conversation with a specific user
- **Authentication:** Required (JWT)
- **URL Parameters:**
  - `id` (string): Other user ID
- **Response (200):**
  ```json
  [
    {
      "_id": "507f1f77bcf86cd799439014",
      "senderId": "507f1f77bcf86cd799439011",
      "receiverId": "507f1f77bcf86cd799439012",
      "message": "Hello! How are you?",
      "createdAt": "2024-01-17T10:30:00.000Z",
      "updatedAt": "2024-01-17T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439015",
      "senderId": "507f1f77bcf86cd799439012",
      "receiverId": "507f1f77bcf86cd799439011",
      "message": "I'm good, thanks for asking!",
      "createdAt": "2024-01-17T10:31:00.000Z",
      "updatedAt": "2024-01-17T10:31:00.000Z"
    }
  ]
  ```
- **Empty Response (200):** Returns `[]` if no conversation exists

---

### Files (`/api/files`)

#### 1. Upload File
- **Endpoint:** `POST /api/files/upload`
- **Description:** Upload a PDF file (form data)
- **Authentication:** Required (JWT)
- **Request Type:** `multipart/form-data`
- **Form Fields:**
  - `file` (File): PDF file to upload
- **Example (curl):**
  ```bash
  curl -X POST http://localhost:2100/api/files/upload \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -F "file=@document.pdf"
  ```
- **Response (201):**
  ```json
  {
    "message": "File uploaded successfully!"
  }
  ```
- **Error Response (400):**
  ```json
  {
    "error": "Only PDF files are allowed!"
  }
  ```

#### 2. Get All Files
- **Endpoint:** `GET /api/files/`
- **Description:** Get metadata of all uploaded files (without file data)
- **Authentication:** Required (JWT)
- **Response (200):**
  ```json
  [
    {
      "_id": "507f1f77bcf86cd799439016",
      "filename": "document.pdf",
      "mimetype": "application/pdf",
      "uploadDate": "2024-01-17T10:35:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439017",
      "filename": "report.pdf",
      "mimetype": "application/pdf",
      "uploadDate": "2024-01-17T10:36:00.000Z"
    }
  ]
  ```

#### 3. Get File by ID
- **Endpoint:** `GET /api/files/:id`
- **Description:** Get a specific file by its ID
- **Authentication:** Required (JWT)
- **URL Parameters:**
  - `id` (string): File ID
- **Response (200):**
  ```json
  {
    "_id": "507f1f77bcf86cd799439016",
    "filename": "document.pdf",
    "mimetype": "application/pdf",
    "data": "base64_encoded_file_data",
    "uploadDate": "2024-01-17T10:35:00.000Z"
  }
  ```

#### 4. Download File
- **Endpoint:** `GET /api/files/:id/download`
- **Description:** Download a file (returns the file data)
- **Authentication:** Required (JWT)
- **URL Parameters:**
  - `id` (string): File ID
- **Response (200):** File content

---

### Chatbot (`/chatbot`)

#### AI Message Suggestion
- **Endpoint:** `POST /chatbot`
- **Description:** Get AI-powered message suggestions based on conversation history
- **Authentication:** Required (JWT)
- **Request Body:**
  ```json
  {
    "text": "Context or prompt for the AI",
    "otherUserId": "507f1f77bcf86cd799439012",
    "conversationId": "optional_conversation_id"
  }
  ```
- **Response (200):**
  ```json
  {
    "suggestion": "That sounds great! Can't wait to catch up."
  }
  ```
- **Error Response (400):**
  ```json
  {
    "error": "Missing 'text' field in body"
  }
  ```

---

## Real-time Features (Socket.IO)

Socket.IO is integrated for real-time messaging. Events include:

- **`newMessage`**: Emitted to the recipient when a new message is sent
- **`userOnline`**: Emitted when a user connects
- **`userOffline`**: Emitted when a user disconnects

---

## Database Models

### User
```javascript
{
  fullName: String,
  username: String (unique),
  password: String (hashed),
  gender: String,
  profilePic: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation
```javascript
{
  participants: [userId, userId],
  messages: [messageId],
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  senderId: userId,
  receiverId: userId,
  message: String,
  createdAt: Date,
  updatedAt: Date
}
```

### File
```javascript
{
  filename: String,
  mimetype: String,
  data: Buffer,
  uploadDate: Date
}
```

---

## Middleware

### Protect Route Middleware
Protects routes that require authentication. Validates JWT token from cookies and attaches user information to `req.user`.

---

## CORS Configuration

The server is configured to accept requests from all origins with credentials (cookies) enabled.

```javascript
app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
    credentials: true
}));
```

---

## Error Handling

All API endpoints return appropriate HTTP status codes:

- **200**: Success
- **201**: Created (successful signup/login/message creation)
- **400**: Bad Request (missing fields, invalid data)
- **500**: Internal Server Error

---

## Development Notes

- The backend uses ES6 modules (`"type": "module"` in package.json)
- Password hashing is done with bcryptjs
- JWT tokens are set in HTTP-only cookies for security
- Profile pictures are generated using DiceBear API
- File uploads are stored in MongoDB as binary data





# MERN Chat App - Frontend

Web frontend for the MERN Chat Application, built with React, Vite, and Tailwind CSS.

## Features

- User authentication (Signup/Login/Logout)
- Real-time messaging with Socket.IO
- Chat conversations with other users
- File upload and sharing
- Responsive UI with Tailwind CSS and DaisyUI
- Message notifications with React Hot Toast
- User sidebar showing available users
- API communication with JWT authentication

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:2100`

## Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

## Environment Setup

Create a `.env.local` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:2100
VITE_SOCKET_URL=http://localhost:2000
```

## Running the Application

Start the development server with Vite:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

Other available commands:

```bash
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

## Project Structure

```
src/
├── assets/           # Static assets (images, etc.)
├── components/       # Reusable React components
│   ├── ChatLayout.jsx
│   ├── files/        # File upload/preview components
│   ├── messages/     # Message display components
│   └── sidebar/      # Sidebar components
├── context/          # React Context (Auth, Socket)
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── home/
│   ├── login/
│   ├── signup/
│   └── files/
├── utils/            # Utility functions
│   ├── api.js        # API helper functions
│   └── extractTime.js
├── zustand/          # State management (Zustand)
├── App.jsx
├── main.jsx
└── index.css
```

## API Connections

The frontend communicates with the backend server at `http://localhost:2100`. All API calls are made through the `apiFetch` utility function which handles authentication via cookies.

### Authentication API

#### Signup
```javascript
POST /api/auth/signup
Body: {
  fullName: string,
  username: string,
  password: string,
  confirmPassword: string,
  gender: "male" | "female"
}
```

#### Login
```javascript
POST /api/auth/login
Body: {
  username: string,
  password: string
}
```

#### Logout
```javascript
POST /api/auth/logout
```

### Users API

#### Get Users for Sidebar
```javascript
GET /api/users/
Response: Array of user objects
```

### Messages API

#### Send Message
```javascript
POST /api/messages/send/:userId
Body: {
  message: string
}
```

#### Get Messages
```javascript
GET /api/messages/:userId
Response: Array of message objects
```

### Files API

#### Upload File
```javascript
POST /api/files/upload
Body: FormData with 'file' field (PDF only)
```

#### Get All Files
```javascript
GET /api/files/
Response: Array of file metadata
```

#### Get File by ID
```javascript
GET /api/files/:fileId
Response: File object with data
```

#### Download File
```javascript
GET /api/files/:fileId/download
```

### Chatbot API

#### Get AI Suggestion
```javascript
POST /chatbot
Body: {
  text: string,
  otherUserId?: string,
  conversationId?: string
}
Response: {
  suggestion: string
}
```

## Real-time Features (Socket.IO)

The frontend connects to the Socket.IO server for real-time messaging:

- **`newMessage`**: Listen for incoming messages
- **`userOnline`**: Listen for user online status
- **`userOffline`**: Listen for user offline status

Socket connection is managed via `SocketContext`.

## State Management

The application uses **Zustand** for state management. The main store is in `src/zustand/useConversation.js` for managing selected conversations.

## Authentication

Authentication is handled through JWT tokens stored in HTTP-only cookies. The `AuthContext` provides user information and authentication status throughout the app. All protected API calls automatically include the JWT token via the `credentials: "include"` option in fetch requests.

## Components Overview

### ChatLayout
Main layout component that displays the sidebar and chat interface.

### MessageContainer
Displays messages for the selected conversation and handles message scrolling.

### MessageInput
Input component for composing and sending messages.

### Conversations
List of all conversations with other users.

### Sidebar
Navigation sidebar with conversations and file management.

## Custom Hooks

The application includes several custom hooks for common operations:

- `useLogin()` - Handle user login
- `useSignup()` - Handle user registration
- `useLogout()` - Handle user logout
- `useGetConversations()` - Fetch list of conversations
- `useGetMessages()` - Fetch messages for a conversation
- `useSendMessage()` - Send a message
- `useListenMessages()` - Listen for real-time messages
- `useGetFiles()` - Fetch uploaded files
- `useGetFile()` - Fetch a specific file
- `useUploadFile()` - Upload a file
- `useChatbot()` - Get AI suggestions

## Styling

The application uses **Tailwind CSS** for styling and **DaisyUI** for pre-built UI components. Tailwind is configured in `tailwind.config.cjs`.

## Development Tips

- Hot Module Replacement (HMR) is enabled by default in Vite
- ESLint is configured for code quality
- JWT token is automatically sent with all authenticated requests via the `credentials: "include"` option
- Use React DevTools browser extension for debugging component state
