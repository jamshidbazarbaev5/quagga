import { useState, useEffect } from 'react';
import { Loader, Button } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useRef } from 'react';

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
        <div className="w-full bg-gray-50 p-2 sm:p-4">
            <div className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold">Mening Bonuslarim</h1>
                    <div className="text-base sm:text-lg font-semibold text-blue-600">
                        Jami: {totalPoints} ball
                    </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    {bonuses.map(bonus => (
                        <div 
                            key={bonus.id} 
                            className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 w-fit">
                                   Ball: {bonus.points}
                                </span>
                                <span className="text-sm text-gray-500">
                                   Sanasi {new Date(bonus.date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 break-all">
                                Kod: {bonus.code}
                            </div>
                        </div>
                    ))}
                </div>

                {loading && (
                    <div className="flex justify-center py-3 sm:py-4">
                        <Loader size="sm" />
                    </div>
                )}

                {hasMore && !loading && (
                    <div className="flex justify-center mt-3 sm:mt-4 px-2 sm:px-0">
                        <Button
                            onClick={handleLoadMore}
                            variant="light"
                            color="blue"
                            className="w-full max-w-xs text-sm sm:text-base py-1 sm:py-2"
                        >
                            Ko'proq yuklash
                        </Button>
                    </div>
                )}

                <div ref={ref} className="h-4" />

                {bonuses.length === 0 && !loading && (
                    <div className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">
                        Bonuslar topilmadi. Ball yig'ish uchun kodlarni skanerlang!
                    </div>
                )}

                {!hasMore && bonuses.length > 0 && (
                    <div className="text-center text-gray-500 py-3 sm:py-4 text-sm sm:text-base">
                        Siz bonus tarixingizning oxiriga yetdingiz
                    </div>
                )}
            </div>
        </div>
    );
};