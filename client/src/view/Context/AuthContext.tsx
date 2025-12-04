/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/user/me");
                setUser(res.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await axios.post("/user/login", { email, password });
            setUser(res.data.user);
            return res.data;
        } catch (error: any) {
            const details = error.response?.data?.message || "Unknown error";

            throw {
                message: `Login failed, ${details}`,
                field: error.response?.data?.field || null
            }
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await axios.post("/user/register", { name, email, password });
            return res.data;

        } catch (error: any) {
            const details = error.response?.data?.message || "Unknown error";

            throw {
                message: `Registration failed, ${details}`,
                field: error.response?.data?.field || null
            }
        }
    };

    const logout = async () => {
        await axios.post("/user/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
