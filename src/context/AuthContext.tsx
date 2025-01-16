import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { refreshToken } from '../utils/auth';

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    bonus: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedUserData = localStorage.getItem('userData');
            const accessToken = localStorage.getItem('accessToken');

            if (storedUserData && accessToken) {
                try {
                    await refreshToken();
                    setUser(JSON.parse(storedUserData));
                } catch (error) {
                    logout();
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}