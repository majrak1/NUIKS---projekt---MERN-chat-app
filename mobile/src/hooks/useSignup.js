import { useState } from "react";
import { Alert } from "react-native";
import { useAuthContext } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
        const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
        if (!success) return;

        setLoading(true);
        try {
            const res = await apiFetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
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

    return { loading, signup };
};

export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
    if (!fullName || !username || !password || !confirmPassword || !gender) {
        Alert.alert("Error", "Please fill in all fields");
        return false;
    }

    if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return false;
    }

    if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters");
        return false;
    }

    return true;
}
