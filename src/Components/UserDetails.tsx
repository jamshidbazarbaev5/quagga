// import React from 'react';
import { User, Phone, Award, Coins } from 'lucide-react';

const UserDetails = ({ user, totalPoints }: { user: any, totalPoints: number | undefined }) => {
  if (!user) {
    return (
      <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400 text-sm">Гость</span>
          <div className="flex items-center space-x-1">
            <Award className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {totalPoints} баллов
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-4">
      <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-3  text-gray-600 dark:text-gray-400">
        <div className=" rounded-full p-1">
          <User className="w-4 h-4" />
        </div>
        <div>
          <h3 className=" text-gray-600 dark:text-gray-400">
            {user.first_name} {user.last_name}
          </h3>
          {/* <p className="text-sm text-gray-500 dark:text-gray-400">Активный пользователь</p> */}
        </div>
      </div>
      
      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
        <Phone className="w-4 h-4" />
        <span className="text-sm">{user.phone}</span>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2   text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          <Coins className="w-4 h-4 " />
          <span className="text-sm text-gray-600 dark:text-gray-400">Баллы</span>
        </div>
        <span className="font-semibold text-blue-500 dark:text-blue-400">
          {user.bonus} баллов
        </span>
      </div>
    </div>
  );
};

export default UserDetails;