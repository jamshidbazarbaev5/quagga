import { useState, useEffect } from 'react';
import { Loader, Button } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useRef } from 'react';
import { Coins } from 'lucide-react';

interface Bonus {
    id: number;
    code: string;
    points: number;
    date: string;
}

// interface Points{
//     totalPoints:number,
// }

const generateMockBonuses = (count: number): Bonus[] => {
    return Array.from({ length: count }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 90));

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const points = Math.floor(Math.random() * 19) * 25 + 50;

        return {
            id: index + 1,
            code,
            points,
            date: date.toISOString().split('T')[0]
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const MOCK_BONUSES = generateMockBonuses(10);

interface BonusesProps {
    onUpdatePoints: (points: number) => void;
}

export const Bonuses = ({ onUpdatePoints }: BonusesProps) => {
    const [bonuses, setBonuses] = useState<Bonus[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 10;
    const [totalPoints, setTotalPoints] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const { ref, entry } = useIntersection({
        root: containerRef.current,
        threshold: 1,
    });

    const fetchBonuses = async (pageNum: number) => {
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const paginatedItems = MOCK_BONUSES.slice(startIndex, endIndex);

            if (pageNum === 1) {
                setBonuses(paginatedItems);
            } else {
                setBonuses(prev => [...prev, ...paginatedItems]);
            }

            const total = MOCK_BONUSES.reduce((sum, bonus) => sum + bonus.points, 0);
            setTotalPoints(total);
            onUpdatePoints(total);

            setHasMore(endIndex < MOCK_BONUSES.length);
        } catch (error) {
            console.error('Failed to fetch bonuses:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBonuses(1);
    }, []);

    useEffect(() => {
        if (entry?.isIntersecting && hasMore && !loading) {
            setPage(prev => prev + 1);
            fetchBonuses(page + 1);
        }
    }, [entry?.isIntersecting]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
            fetchBonuses(page + 1);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Мои Бонусы</h1>
                <div className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                    Всего: {totalPoints} баллов
                </div>
            </div>

            {bonuses.map(bonus => (
                <div key={bonus.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                        <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 text-base">Бонусный код</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{bonus.code}</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    {new Date(bonus.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                    {bonus.points} баллов
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {loading && (
                <div className="flex justify-center py-4">
                    <Loader size="sm" />
                </div>
            )}

            {hasMore && !loading && (
                <div className="flex justify-center mt-3">
                    <Button
                        onClick={handleLoadMore}
                        variant="light"
                        color="blue"
                        className="w-full max-w-xs text-sm py-1 dark:bg-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-900/70"
                    >
                        Загрузить ещё
                    </Button>
                </div>
            )}

            <div ref={ref} className="h-4" />

            {bonuses.length === 0 && !loading && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm">
                    Бонусы не найдены. Сканируйте коды, чтобы получить баллы!
                </div>
            )}

            {!hasMore && bonuses.length > 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-3 text-sm">
                    Вы достигли конца истории бонусов
                </div>
            )}
        </div>
    );
};





