const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint, options = {}) => {
    // Ensure cookies (JWT) are sent cross-origin when backend uses cookie-based auth
    const fetchOptions = {
        headers: { "Content-Type": "application/json", ...options.headers },
        credentials: "include", // <-- important: sends cookies
        ...options,
    };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    // console.log(`apiFetch: ${API_BASE_URL}${endpoint}`);
    // console.log("options", fetchOptions);
    // console.log("res", res);

    if (!res.ok) {
        // Try to parse JSON error body for a clearer message
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
};

