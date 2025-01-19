import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      // General
      loading: 'Загрузка...',
      error: 'Ошибка',
      close: 'Закрыть',
      success: 'Выполнено!',
      
      // Auth
      login: 'Вход',
      logout: 'Выйти',
      username: 'Имя пользователя',
      password: 'Пароль',
      loginError: 'Неверный логин или пароль',
      
      // Navigation
      scan: 'Сканировать',
      reset: 'Сбросить',
      bonusArchive: 'Архив Бонусов',
      rewards: 'Вознаграждения',
      profile: 'Профиль',
      editProfile: 'Редактировать профиль',
      
      // Scanner
      totalPoints: 'Всего баллов',
      scannedCodes: 'Отсканировано кодов',
      today: 'Сегодня',
      scanError: 'Этот код уже был отсканирован!',
      browserNotSupported: 'Браузер не поддерживается',
      cameraPermission: 'Нет доступа к камере',
      openInBrowser: 'Открыть в браузере',
      
      // Profile
      firstName: 'Имя',
      lastName: 'Фамилия',
      phone: 'Номер телефона',
      newPassword: 'Новый пароль',
      updateProfile: 'Обновить профиль',
      show: 'Показать',
      hide: 'Скрыть',
      myBonuses: 'Мои Бонусы',
      total: 'Всего',
      points: 'баллов',
      invalidDateRange: 'Выберите корректный диапазон дат',
      noBonusesFound: 'Бонусы не найдены за выбранный период',
      ball: 'балл',
      bonus_code: 'Код бонуса',
      required: 'Требуется',
      prize: 'Приз',
      tariffs: 'Тарифы',
      accumulate: 'Накапливайте баллы и получайте призы!'
    }
  },
  uz: {
    translation: {
      // General
      loading: 'Yuklanmoqda...',
      error: 'Xato',
      close: 'Yopish',
      success: 'Bajarildi!',
      
      // Auth
      login: 'Kirish',
      logout: 'Chiqish',
      username: 'Foydalanuvchi nomi',
      password: 'Parol',
      loginError: "Noto'g'ri login yoki parol",
      
      // Navigation
      scan: 'Skanerlash',
      reset: "O'chirish",
      bonusArchive: 'Bonuslar arxivi',
      rewards: 'Mukofotlar',
      profile: 'Profil',
      editProfile: 'Profilni tahrirlash',
      
      // Scanner
      totalPoints: 'Jami ballar',
      scannedCodes: 'Skaner qilingan kodlar',
      today: 'Bugun',
      scanError: 'Bu kod allaqachon skanerlangan!',
      browserNotSupported: "Brauzer qo'llab-quvvatlanmaydi",
      cameraPermission: "Kameraga ruxsat yo'q",
      openInBrowser: 'Brauzerda ochish',
      
      // Profile
      firstName: 'Ism',
      lastName: 'Familiya',
      phone: 'Telefon raqami',
      newPassword: 'Yangi parol',
      updateProfile: 'Profilni yangilash',
      show: "Ko'rsatish",
      hide: 'Yashirish',
      myBonuses: 'Mening Bonuslarim',
      total: 'Jami',
      points: 'ball',
      invalidDateRange: 'Yaroqli sana oralig\'ini tanlang',
      noBonusesFound: 'Tanlangan davr uchun bonuslar topilmadi',
      ball: 'ball',
      bonus_code: 'Bonus kodi',
      required: 'Talab qilinadi',
      prize: 'Mukofot',
      tariffs: 'Ta\'riflar',
      accumulate: 'Ball toplang va sovgalar oling!'
    }
  }
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'uz', // Get saved language or default to 'uz'
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;