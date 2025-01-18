import { Loader } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useEffect, useRef } from 'react';
import { Coins } from 'lucide-react';
import { useBonusHistory } from '../api/scan';

interface BonusesProps {
    onUpdatePoints: (points: number) => void;
}

export const Bonuses = ({ onUpdatePoints }: BonusesProps) => {
    const { data: bonusHistory, isLoading } = useBonusHistory();

    const containerRef = useRef<HTMLDivElement>(null);
    const { ref } = useIntersection({
        root: containerRef.current,
        threshold: 1,
    });

    useEffect(() => {
        if (bonusHistory?.total_bonuses) {
            onUpdatePoints(bonusHistory.total_bonuses);
        }
    }, [bonusHistory?.total_bonuses, onUpdatePoints]);

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Мои Бонусы</h1>
                <div className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                    Всего: {bonusHistory?.total_bonuses || 0} баллов
                </div>
            </div>

            {bonusHistory?.results.map((bonus, index) => (
                <div key={bonus.barcode_data + index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                        <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 text-base">Бонусный код</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{bonus.barcode_data}</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    {new Date(bonus.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                    {Number(bonus.bonus)} баллов
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="flex justify-center py-4">
                    <Loader size="sm" />
                </div>
            )}

            <div ref={ref} className="h-4" />

            {bonusHistory?.results.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm">
                    Бонусы не найдены. Сканируйте коды, чтобы получить баллы!
                </div>
            )}
        </div>
    );
};