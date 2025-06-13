import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("accessToken"));
  const { t } = useTranslation();

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

  const handleTokenLogin = (token: string) => {
    setIsLoading(true);
    try {
      // Save the token directly from URL
      localStorage.setItem("accessToken", token);
      setHasToken(true);
      navigate("/", { replace: true });
    } catch (err) {
      setError(t("loginError"));
      setHasToken(false);
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
            {hasToken && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    localStorage.removeItem("accessToken");
                    setHasToken(false);
                  }}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
                >
                  {t("clearToken")}
                </button>
              </div>
            )}
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
