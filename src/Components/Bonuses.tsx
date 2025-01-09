import { Paper, Text, Stack, Badge } from '@mantine/core';

export const Bonuses = () => {
    const bonuses = [
        { id: 1, code: '123456', points: 100, date: '2024-03-20' },
        { id: 2, code: '789012', points: 50, date: '2024-03-19' },
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Bonuses</h1>
                <div className="space-y-4">
                    {bonuses.map(bonus => (
                        <div 
                            key={bonus.id} 
                            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {bonus.points} points
                                </span>
                                <span className="text-sm text-gray-500">
                                    {bonus.date}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                Code: {bonus.code}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};