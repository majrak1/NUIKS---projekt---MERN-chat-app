# Network Request Failed - Fix Guide

## The Problem
"Network request failed" error on iOS simulator when trying to log in.

## Solutions

### ✅ Solution 1: Use Your Computer's IP Address (Recommended)

If `localhost` doesn't work on iOS simulator, use your computer's IP address:

1. **Find your IP address:**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Or use this to get just the IP
   ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'
   ```

2. **Update your `.env` file:**
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://YOUR_IP:2100
   EXPO_PUBLIC_SOCKET_URL=http://YOUR_IP:2000
   ```
   
   Example (replace with your actual IP):
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://10.0.1.148:2100
   EXPO_PUBLIC_SOCKET_URL=http://10.0.1.148:2000
   ```

3. **Restart Expo:**
   ```bash
   npm start
   ```

### ✅ Solution 2: Check Backend Server

Make sure your backend is running:
```bash
cd ../backend
npm start
```

Verify it's accessible:
- Open `http://localhost:2100/api/users` in your browser
- You should see a response (or authentication error, but not connection refused)

### ✅ Solution 3: iOS Simulator Network Settings

Sometimes iOS simulator has network issues. Try:

1. **Reset iOS Simulator:**
   - iOS Simulator → Device → Erase All Content and Settings...

2. **Restart Expo with cleared cache:**
   ```bash
   npx expo start -c
   ```

### ✅ Solution 4: Verify Backend CORS Settings

Make sure your backend allows connections from the simulator. Check `backend/server.js` - it should have:
```javascript
app.use(cors({
    origin: true, // Allows all origins
    credentials: true
}));
```

## Current Configuration

The app is now configured to:
- **Android Emulator**: Automatically use `http://10.0.2.2:2100`
- **iOS Simulator**: Use `http://localhost:2100` by default
- **Physical Device**: Use the IP address from `.env` file
- **Override**: If `.env` has `EXPO_PUBLIC_API_BASE_URL`, it will be used for all platforms

## Testing

After fixing, test by:
1. Opening the app on simulator
2. Try to log in
3. Check the terminal for any error messages
4. Verify backend logs show the request arriving

If it still doesn't work, check the backend logs to see if requests are reaching it.
