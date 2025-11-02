# Quick Setup Guide

## Installation Steps

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Configure API URLs:**
   
   For **physical devices** (phone/tablet):
   - Find your computer's local IP address:
     - Mac/Linux: `ifconfig | grep "inet " | grep -v 127.0.0.1`
     - Windows: `ipconfig` (look for IPv4 Address)
   - Create a `.env` file in the `mobile` directory:
     ```env
     EXPO_PUBLIC_API_BASE_URL=http://YOUR_LOCAL_IP:2100
     EXPO_PUBLIC_SOCKET_URL=http://YOUR_LOCAL_IP:2000
     ```
   - Example: `EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:2100`

   For **Android Emulator**:
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:2100
   EXPO_PUBLIC_SOCKET_URL=http://10.0.2.2:2000
   ```

   For **iOS Simulator**:
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://localhost:2100
   EXPO_PUBLIC_SOCKET_URL=http://localhost:2000
   ```

3. **Start the backend server** (from the backend directory):
   ```bash
   cd ../backend
   npm start
   ```

4. **Start Expo** (from the mobile directory):
   ```bash
   cd mobile
   npm start
   # or
   expo start
   ```

5. **Fix EMFILE error (if you see "too many open files" error):**
   
   **Best solution - Install Watchman:**
   ```bash
   brew install watchman
   ```
   Then restart: `npm start`
   
   **Alternative - Increase file limit:**
   ```bash
   ulimit -n 4096
   npm start
   ```
   
   **Or use the workaround:**
   ```bash
   npm start -- --no-dev
   ```

6. **Run on device:**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator, `a` for Android emulator

## Project Structure

The mobile app mirrors the web app structure:

- `src/pages/` - Screen components (Login, SignUp, Home)
- `src/components/` - Reusable components (ChatLayout, Messages, Sidebar)
- `src/hooks/` - Custom hooks (useLogin, useSignup, etc.)
- `src/context/` - Context providers (Auth, Socket)
- `src/utils/` - Utility functions (API calls, time formatting)
- `src/zustand/` - State management store

## Key Differences from Web App

1. **Storage**: Uses `AsyncStorage` instead of `localStorage`
2. **Navigation**: Uses React Navigation instead of React Router
3. **Styling**: Uses React Native StyleSheet instead of Tailwind CSS
4. **Components**: Uses React Native components (View, Text, TextInput, etc.)
5. **Alerts**: Uses React Native `Alert` instead of toast notifications

## Troubleshooting

- **Connection refused**: Make sure backend is running and URLs are correct
- **CORS errors**: Backend should allow all origins (already configured)
- **Module not found**: Run `npm install` again
- **Expo cache issues**: Run `expo start -c` to clear cache
