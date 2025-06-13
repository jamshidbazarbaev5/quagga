import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("accessToken"));
  const { t } = useTranslation();
  const { setUser } = useAuth();

  useEffect(() => {
    // Check if we're in Telegram WebApp context
    if (window.Telegram?.WebApp) {
      const webAppData = window.Telegram.WebApp;
      console.log('Telegram WebApp Data:', webAppData.initDataUnsafe);
      
      // If we have WebApp data, we can use it to initialize the user
      if (webAppData.initDataUnsafe?.user) {
        const tgUser = webAppData.initDataUnsafe.user;
        // Get existing user data if any
        const existingUserData = localStorage.getItem("userData");
        const existingUser = existingUserData ? JSON.parse(existingUserData) : null;
        
        // Format the user data to match our User interface
        const userData = {
          id: tgUser.id,
          username: tgUser.username || '',
          first_name: tgUser.first_name || '',
          last_name: tgUser.last_name || '',
          phone: existingUser?.phone || '',  // Keep existing phone if available
          bonus: existingUser?.bonus || '0'  // Keep existing bonus if available
        };
        setUser(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
      }
    }
  }, [setUser]);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      handleTokenLogin(token);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleStorageChange = () => {
      setHasToken(!!localStorage.getItem("accessToken"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleTokenLogin = async (token: string) => {
    setIsLoading(true);
    try {
      // Save the token directly from URL
      localStorage.setItem("accessToken", token);
      setHasToken(true);

      // Fetch user data
      const response = await api.get('/user/me');
      const userData = response.data;
      
      console.log('Login - Received user data:', userData);

      // If we have Telegram WebApp data, merge it with the API data
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
        userData.first_name = userData.first_name || tgUser.first_name || '';
        userData.last_name = userData.last_name || tgUser.last_name || '';
        userData.username = userData.username || tgUser.username || '';
      }
      
      // Save user data
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
      
      navigate("/", { replace: true });
    } catch (err) {
      setError(t("loginError"));
      setHasToken(false);
      localStorage.removeItem("accessToken");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <LogIn className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {t("login")}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${hasToken ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {hasToken ? t("tokenFound") : t("noToken")}
              </span>
            </div>
           
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-300">
              {t("telegramLoginMessage")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
