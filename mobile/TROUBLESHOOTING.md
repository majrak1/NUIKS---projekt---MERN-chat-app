# Troubleshooting Guide

## Common Issues

### 1. EMFILE: too many open files

This is a macOS file watcher limit issue. Try these solutions:

**Option A: Install Watchman (Recommended)**
```bash
brew install watchman
```

Then restart Expo:
```bash
npm start
```

**Option B: Increase file limit temporarily**
```bash
ulimit -n 4096
npm start
```

**Option C: Use Expo's watchman flag**
```bash
npm start -- --watchman
```

**Option D: Disable file watching (if others don't work)**
Create or update `metro.config.js`:
```js
module.exports = {
  watchFolders: [],
  watchman: {
    enabled: false
  }
};
```

### 2. Package Version Mismatch

If you see warnings about package versions:
```bash
npm install
npx expo install --fix
```

### 3. Module Not Found Errors

Clear cache and reinstall:
```bash
rm -rf node_modules
rm -rf .expo
npm install
npx expo start -c
```

### 4. Connection Issues

Make sure:
- Backend server is running
- API URLs in `.env` are correct for your platform:
  - Physical device: Your computer's local IP
  - Android emulator: `http://10.0.2.2:2100`
  - iOS simulator: `http://localhost:2100`

### 5. Navigation Errors

If you see navigation-related errors, ensure all React Navigation dependencies are installed:
```bash
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context react-native-gesture-handler
```

### 6. Import/Export Errors

Make sure all file extensions are correct:
- Components should use `.jsx` or `.js`
- All imports should match the actual file paths

## Quick Fix Commands

```bash
# Full reset
rm -rf node_modules .expo package-lock.json
npm install
npx expo start -c

# With watchman (if installed)
watchman watch-del-all
npm start
```
