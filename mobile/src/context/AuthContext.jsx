import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userStr = await AsyncStorage.getItem("chat-user");
                if (userStr) {
                    setAuthUser(JSON.parse(userStr));
                }
            } catch (error) {
                console.error("Error loading user:", error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const updateAuthUser = async (user) => {
        if (user) {
            await AsyncStorage.setItem("chat-user", JSON.stringify(user));
            setAuthUser(user);
        } else {
            await AsyncStorage.removeItem("chat-user");
            setAuthUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser: updateAuthUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
