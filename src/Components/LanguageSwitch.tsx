import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang)
    localStorage.setItem("language", newLang);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleLanguageChange}
      className="px-3 py-1 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 
                border border-gray-300 dark:border-gray-600 hover:border-gray-400 
                dark:hover:border-gray-500 bg-white dark:bg-gray-800 
                cursor-pointer outline-none"
    >
      <option
        value="ru"
        className="text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 
                   hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        RU
      </option>
      <option
        value="uz"
        className="text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 
                   hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        UZ
      </option>
    </select>
  );
};
