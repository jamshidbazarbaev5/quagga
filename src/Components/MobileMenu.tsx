'use client'

import { X, FileText, LogIn, UserPlus,  CreditCard, ScanBarcode } from 'lucide-react'

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    totalPoints?: number;
}

export default function MobileMenu({ isOpen, setIsOpen, totalPoints  }: MobileMenuProps) {
//   const [isOpen, setIsOpen] = useState(true)

  return (
    <div 
      className={`fixed inset-0 transition-opacity duration-300 ease-in-out z-50 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
      <div 
        className={`fixed top-0 left-0 w-[280px] h-full bg-white shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-6">
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-gray-800">Scanner</h1>
            <p className="text-blue-600 font-semibold mt-2">
              {totalPoints} ball
            </p>
          </div>

         

          <div className="space-y-5 mb-10">
          <a href="/" className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 transition-colors">
              <ScanBarcode className="w-5 h-5" />
              <span>Сканировать</span>
            </a>
            <a href='/bonuses' className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 transition-colors">
              <FileText className="w-5 h-5" />
              <span> Мой Бонусы</span>
            </a>
            <a href="/tarifi" className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 transition-colors">
              <CreditCard className="w-5 h-5" />
              <span>Тарифи</span>
            </a>
            
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-5">Профиль</h3>
            <a href="/login" className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 transition-colors mb-4">
              <LogIn className="w-5 h-5" />
              <span>Вход</span>
            </a>
            <a href="/register" className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 transition-colors">
              <UserPlus className="w-5 h-5" />
              <span>Регистрация</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

