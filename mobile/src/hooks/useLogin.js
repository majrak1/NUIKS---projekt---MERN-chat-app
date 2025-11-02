import { useState } from "react";
import { Alert } from "react-native";
import { useAuthContext } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async (username, password) => {
        const success = handleInputErrors(username, password);
        if (!success) return;
        setLoading(true);
        try {
            const res = await apiFetch(`/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setAuthUser(data);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;

function handleInputErrors(username, password) {
    if (!username || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return false;
    }
    return true;
}
