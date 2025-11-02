import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Determine the correct API URL based on the platform and environment
const getApiBaseUrl = () => {
    // If explicitly set in environment, use that
    if (process.env.EXPO_PUBLIC_API_BASE_URL) {
        return process.env.EXPO_PUBLIC_API_BASE_URL;
    }

    // For iOS simulator, localhost should work, but sometimes needs IP
    // For Android emulator, use 10.0.2.2
    // For physical devices, use local IP (set in .env)
    if (Platform.OS === 'android') {
        // Android emulator
        return "http://10.0.2.2:2100";
    } else {
        // iOS simulator - try localhost first, fallback to IP if needed
        // Note: If localhost doesn't work, use your computer's IP in .env file
        return "http://localhost:2100";
    }
};

const API_BASE_URL = getApiBaseUrl();

// Log the API URL being used (for debugging)
console.log(`[API] Using base URL: ${API_BASE_URL}`);

export const apiFetch = async (endpoint, options = {}) => {
    try {
        // Get token from AsyncStorage if available
        const userStr = await AsyncStorage.getItem('chat-user');
        let headers = { "Content-Type": "application/json", ...options.headers };

        // Add cookie/auth token if user exists
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                // If your backend uses cookies, they'll be handled automatically
                // If it uses Authorization header, uncomment below:
                // headers.Authorization = `Bearer ${user.token}`;
            } catch (e) {
                // Ignore parse errors
            }
        }

        const fetchOptions = {
            headers,
            credentials: "include",
            ...options,
        };

        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`[API] Fetching: ${url}`); // Debug log

        const res = await fetch(url, fetchOptions);

        if (!res.ok) {
            let bodyText = "";
            try {
                const data = await res.json();
                bodyText = data?.error || data?.message || JSON.stringify(data);
            } catch (e) {
                try {
                    bodyText = await res.text();
                } catch (_) {
                    bodyText = "(no response body)";
                }
            }
            throw new Error(`HTTP error! Status: ${res.status} ${bodyText}`);
        }

        return res;
    } catch (error) {
        // Enhanced error logging for network issues
        if (error.message === 'Network request failed' || error.message.includes('Failed to fetch')) {
            console.error(`[API Error] Network request failed to ${API_BASE_URL}`);
            console.error(`[API Error] Make sure:`);
            console.error(`  1. Backend server is running on port 2100`);
            console.error(`  2. Using correct URL in .env file`);
            console.error(`  3. For iOS simulator, try using your computer's IP instead of localhost`);
            throw new Error(`Network request failed. Is your backend server running on ${API_BASE_URL}?`);
        }
        throw error;
    }
};
