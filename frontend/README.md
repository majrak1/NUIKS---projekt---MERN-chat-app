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
