// import React from 'react';
import { User, Phone, Award, Coins } from 'lucide-react';
import { useBonusHistory } from '../api/scan';

const UserDetails = ({ user, totalPoints }: { user: any, totalPoints: number | undefined }) => {
  const { data: bonusHistory, isLoading: bonusHistoryLoading } = useBonusHistory();

  if(bonusHistoryLoading){
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  }
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
         {bonusHistory?.total_bonuses} баллов
        </span>
      </div>
    </div>
  );
};

export default UserDetails;