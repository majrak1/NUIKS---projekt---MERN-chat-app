# Quick Fix for EMFILE Error

## The Problem
You're seeing: `Error: EMFILE: too many open files, watch`

This is a macOS file watcher limit issue.

## Solutions (try in order):

### ✅ Solution 1: Install Watchman (Best Option)
```bash
brew install watchman
npm start
```

### ✅ Solution 2: Use the Safe Start Script
```bash
npm run start:safe
```

### ✅ Solution 3: Manually Increase Limit
```bash
ulimit -n 4096
npm start
```

### ✅ Solution 4: Use Production Mode (less watching)
```bash
npx expo start --no-dev
```

### ✅ Solution 5: Permanent Fix (if above don't work)
Add to your `~/.zshrc` or `~/.bash_profile`:
```bash
ulimit -n 4096
```

Then restart terminal and run `npm start`

---

## After Fixing

Once the app starts successfully, you should see:
- Metro bundler running
- QR code displayed
- Options to press `i` for iOS, `a` for Android

If you still see errors, check:
1. Backend server is running
2. `.env` file has correct API URLs
3. All dependencies installed: `npm install`
