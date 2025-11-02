import { createContext, useState, useEffect, useContext } from "react";
import { Platform } from "react-native";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            // Update this URL to match your backend server
            // For physical devices: use your computer's local IP (e.g., http://192.168.1.100:2000)
            // For Android emulator: use http://10.0.2.2:2000
            // For iOS simulator: http://localhost:2000 (if doesn't work, use IP from .env)
            const getSocketUrl = () => {
                if (process.env.EXPO_PUBLIC_SOCKET_URL) {
                    return process.env.EXPO_PUBLIC_SOCKET_URL;
                }
                // Default to localhost for iOS, 10.0.2.2 for Android
                return Platform.OS === 'android' ? "http://10.0.2.2:2000" : "http://localhost:2000";
            };
            const SOCKET_URL = getSocketUrl();
            
            const socketInstance = io(SOCKET_URL, {
                query: {
                    userId: authUser._id,
                },
                transports: ['websocket'],
            });

            setSocket(socketInstance);

            socketInstance.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => socketInstance.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
