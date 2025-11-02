# Immediate Fix for "Network request failed"

## Problem
You're getting "Network request failed" when trying to log in or sign up.

## Quick Fix Steps

### Step 1: Make sure backend is running

Open a new terminal and run:
```bash
cd backend
npm start
```

Wait until you see: `Server is running on port 2100`

### Step 2: Update your .env file

Edit `mobile/.env` and change it to use your IP address instead of localhost:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.1.148:2100
EXPO_PUBLIC_SOCKET_URL=http://10.0.1.148:2000
```

**Important:** Replace `10.0.1.148` with your actual IP if different. Find it with:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'
```

### Step 3: Restart Expo

After updating `.env`, restart Expo:
```bash
# Stop current Expo (Ctrl+C)
# Then restart:
cd mobile
npm start
```

### Step 4: Test connection

The app will now log the API URL in the console. Check:
1. Expo terminal should show: `[API] Using base URL: http://10.0.1.148:2100`
2. When you try to log in, you should see: `[API] Fetching: http://10.0.1.148:2100/api/auth/login`
3. Check backend terminal - you should see the request arriving

## If it still doesn't work:

1. **Verify backend is accessible:**
   ```bash
   curl http://10.0.1.148:2100/api/users
   ```
   (Should return data or error, but NOT "connection refused")

2. **Check firewall:** Make sure your Mac firewall allows connections on port 2100

3. **Try on physical device:** Sometimes simulators have network issues. Test on your phone using Expo Go.

## Debugging

Check the console logs:
- Expo terminal shows the API URL being used
- Network requests are logged: `[API] Fetching: ...`
- Errors show helpful messages

The enhanced error messages will tell you exactly what's wrong!
