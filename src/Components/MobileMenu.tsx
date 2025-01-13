"use client";

import { X, LogIn, ScanBarcode, CoinsIcon, Gift } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDetails from "./UserDetails";
import { useState, useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  totalPoints?: number;
}

export default function MobileMenu({
  isOpen,
  setIsOpen,
  totalPoints,
}: MobileMenuProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLinkClick = (path: string) => {
    if (!user) {
      setErrorMessage('Пожалуйста, войдите в систему, чтобы получить доступ к этому разделу.');
      setTimeout(() => {
        setIsOpen(false);
        navigate("/login");
      }, 2000);
      return;
    }
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
        setIsOpen(false);
    }
}, [user, setIsOpen]);

  return (
    <div
      className={`fixed inset-0 transition-opacity duration-300 ease-in-out z-50 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 w-[280px] h-full bg-white dark:bg-gray-800 shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-[1.8rem] right-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              EasyBonus
            </h1>
            <UserDetails user={user} totalPoints={totalPoints} />
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm">
              {errorMessage}
            </div>
          )}

          <div className="space-y-5 mb-10">
            <Link
              to="/"
              onClick={() => handleLinkClick('/')}
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <ScanBarcode className="w-5 h-5" />
              <span>Сканировать</span>
            </Link>
            <Link
              to="/bonuses"
              onClick={() => handleLinkClick('/bonuses')}
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <CoinsIcon className="w-5 h-5" />
              <span>Архив Бонусов</span>
            </Link>
            <Link
              to="/tarifi"
              onClick={() => handleLinkClick('/tarifi')}
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <Gift className="w-5 h-5" />
              <span>Вознаграждение</span>
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-5">
              Профиль
            </h3>
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors mb-4"
              >
                <LogIn className="w-5 h-5" />
                <span>Выйти</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => handleLinkClick('/login')}
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-4"
              >
                <LogIn className="w-5 h-5" />
                <span>Вход</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
