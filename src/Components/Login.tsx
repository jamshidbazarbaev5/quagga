import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const API_URL = "https://turan.easybonus.uz";

export const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      handleTokenLogin(token);
    }
  }, [searchParams]);

  const handleTokenLogin = async (token: string) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || t("loginError"));
      }

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("userData", JSON.stringify(data.user));

      setUser(data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("loginError")
      );
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
