# MERN Chat App - Mobile (React Native)

This is the React Native mobile version of the MERN Chat App, built with Expo.

## Features

- User authentication (Login/Signup)
- Real-time messaging using Socket.IO
- Chat conversations list
- Send and receive messages
- Online user status
- Dark theme UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: Xcode (Mac only)
- For Android: Android Studio

## Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### Environment Variables

The app uses environment variables for API configuration. You can create a `.env` file in the `mobile` directory:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:2100
EXPO_PUBLIC_SOCKET_URL=http://localhost:2000
```

**Important for Physical Devices:**
- When testing on a physical device, replace `localhost` with your computer's local IP address
- Find your IP address using:
  - Mac/Linux: `ifconfig` or `ip addr`
  - Windows: `ipconfig`
- Example: `EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:2100`

**Important for Android Emulator:**
- Use `10.0.2.2` instead of `localhost` for Android emulator
- Example: `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:2100`

**Important for iOS Simulator:**
- `localhost` should work fine for iOS simulator

## Running the App

1. Start the Expo development server:
```bash
npm start
# or
expo start
```

2. Run on a specific platform:
```bash
npm run ios      # Run on iOS simulator
npm run android  # Run on Android emulator
```

3. Scan the QR code with:
   - **iOS**: Camera app or Expo Go app
   - **Android**: Expo Go app

## Project Structure

```
mobile/
├── App.js                 # Main app entry with navigation
├── src/
│   ├── components/        # React components
│   │   ├── ChatLayout.jsx
│   │   ├── messages/      # Message-related components
│   │   └── sidebar/       # Sidebar components
│   ├── context/           # Context providers
│   │   ├── AuthContext.jsx
│   │   └── SocketContext.jsx
│   ├── hooks/             # Custom hooks
│   │   ├── useLogin.js
│   │   ├── useSignup.js
│   │   ├── useLogout.js
│   │   ├── useGetConversations.js
│   │   ├── useGetMessages.js
│   │   ├── useSendMessage.js
│   │   └── useListenMessages.js
│   ├── pages/             # Screen components
│   │   ├── login/
│   │   ├── signup/
│   │   └── home/
│   ├── utils/             # Utility functions
│   │   ├── api.js
│   │   └── extractTime.js
│   └── zustand/           # State management
│       └── useConversation.js
└── package.json
```

## Key Dependencies

- **expo**: Expo framework
- **react-navigation**: Navigation between screens
- **socket.io-client**: Real-time messaging
- **zustand**: State management
- **@react-native-async-storage/async-storage**: Local storage (replaces localStorage)

## Backend Connection

Make sure your backend server is running on the configured port (default: 2100 for API, 2000 for Socket.IO).

The mobile app connects to the same backend as the web app, so all API endpoints and Socket.IO events are shared.

## Troubleshooting

### Connection Issues
- Ensure the backend server is running
- Check that the API URL is correct for your device/emulator
- Verify firewall settings allow connections

### Build Issues
- Clear Expo cache: `expo start -c`
- Delete `node_modules` and reinstall
- Check Node.js version compatibility

## Notes

- The app uses AsyncStorage instead of localStorage for data persistence
- Navigation is handled by React Navigation (native stack)
- Styling uses React Native StyleSheet (no Tailwind CSS)
- Socket.IO connection uses WebSocket transport for better mobile performance
