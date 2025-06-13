import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      handleTokenLogin(token);
    }
  }, [searchParams]);

  const handleTokenLogin = (token: string) => {
    try {
      // Save the token directly from URL
      localStorage.setItem("accessToken", token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(t("loginError"));
    }
  };

  if (searchParams.get("token")) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // User doesn't have a Telegram token, redirect to Telegram
  window.location.href = "https://t.me/Turan_easyBonus_bot";
  return null;
};
