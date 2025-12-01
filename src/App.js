import React, { useState, useEffect } from 'react';

const FOOD_ITEMS = [
    "Бобові 50г/картопля 180г/кукурудза свіжа 180г/пластівці 50г/булгур 50г/гречка 50г/рис (не шліфований) 50г/будь-яка крупа 50г/цільнозернове борошно 50г/Хлібці 80г/цільнозерновий хліб 85г/макарони т.с. 50г/лаваш 80г",
    "Бобові 50г/картопля 180г/кукурудза свіжа 180г/пластівці 50г/булгур 50г/гречка 50г/рис (не шліфований) 50г/будь-яка крупа 50г/цільнозернове борошно 50г/Хлібці 80г/цільнозерновий хліб 85г/макарони т.с. 50г/лаваш 80г",
    "Овочі (квашені також і зелень)/гриби/ (300 г)",
    "Овочі (квашені також і зелень)/гриби/ (300 г)",
    "Телятина(160)/печінка(160)/куряче або індиче філе(190г)/риба (до 5% жиру 185г, від 5% 125г)/3 яйця /морепродукти 220г",
    "Телятина(160)/печінка(160)/куряче або індиче філе(190г)/риба (до 5% жиру 185г, від 5% 125г)/3 яйця /морепродукти 220г",
    "Смаколики 55г або 550г фруктів або 200г калорійних фруктів (банани, виноград, хурма чи манго)",
    "Сир 55 г або несолодкий йогурт 1,6%жиру 370г",
    "Горіхи або насіння 20г",
    "Фрукти та ягоди 300г (якщо це банани, виноград, хурма чи манго, то 180г)",
    "Несолодкий йогурт/1,5-2,5% 200г",
    "Будь-яка олія 12 г/авокадо 65г/оливки 80г/гірчиця 28г/майонез 15г/кетчуп 42г",
    "Будь-яка олія 12 г/авокадо 65г/оливки 80г/гірчиця 28г/майонез 15г/кетчуп 42г",
];

export default function FoodTracker() {
    const [completed, setCompleted] = useState([]);
    const [history, setHistory] = useState({});
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('today');
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const loadData = () => {
            try {
                // Завантажуємо дані сьогоднішнього дня
                const todayData = localStorage.getItem(`food-${today}`);
                if (todayData) {
                    setCompleted(JSON.parse(todayData));
                }

                // Завантажуємо історію
                const historyData = localStorage.getItem('food-history');
                if (historyData) {
                    setHistory(JSON.parse(historyData));
                }
            } catch (error) {
                console.log('Помилка завантаження даних:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [today]);

    const saveData = (newCompleted) => {
        try {
            // Зберігаємо дані сьогоднішнього дня
            localStorage.setItem(`food-${today}`, JSON.stringify(newCompleted));

            // Оновлюємо історію
            const newHistory = { ...history, [today]: newCompleted.length };
            localStorage.setItem('food-history', JSON.stringify(newHistory));
            setHistory(newHistory);
        } catch (error) {
            console.error('Помилка збереження:', error);
        }
    };

    const toggleItem = (index) => {
        const newCompleted = completed.includes(index)
            ? completed.filter(i => i !== index)
            : [...completed, index];

        setCompleted(newCompleted);
        saveData(newCompleted);
    };

    const getPast30Days = () => {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    };

    const getIntensity = (count) => {
        if (count === 0) return 'bg-gray-200';
        if (count <= 4) return 'bg-green-200';
        if (count <= 8) return 'bg-green-400';
        if (count <= 11) return 'bg-green-600';
        return 'bg-green-800';
    };

    const sortedItems = FOOD_ITEMS.map((item, idx) => ({
        text: item,
        index: idx,
        completed: completed.includes(idx)
    })).sort((a, b) => a.completed - b.completed);

    const allCompleted = completed.length === FOOD_ITEMS.length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Завантаження...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">🍽️ Трекер Харчування</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setView('today')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'today'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                📅 Сьогодні
                            </button>
                            <button
                                onClick={() => setView('history')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'history'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                📊 Історія
                            </button>
                        </div>
                    </div>

                    <div className="text-center mb-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                        <div className="text-lg font-semibold text-gray-700">
                            {new Date().toLocaleDateString('uk-UA', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <div className="text-3xl font-bold text-green-600 mt-2">
                            {completed.length} / {FOOD_ITEMS.length}
                        </div>
                        <div className="text-sm text-gray-600">пунктів виконано</div>
                    </div>
                </div>

                {view === 'today' ? (
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        {allCompleted ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">✅</div>
                                <h2 className="text-2xl font-bold text-green-600 mb-2">
                                    Ви вже все з'їли на сьогодні!
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Більше пийте води, чаю, кави, але не соків і солодкої води 💧
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sortedItems.map(({ text, index, completed }) => (
                                    <div
                                        key={index}
                                        onClick={() => toggleItem(index)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${completed
                                                ? 'bg-green-50 border-green-300 opacity-60'
                                                : 'bg-white border-gray-200 hover:border-green-400 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center mt-1 ${completed
                                                    ? 'bg-green-600 border-green-600'
                                                    : 'border-gray-300'
                                                }`}>
                                                {completed && <span className="text-white text-sm">✓</span>}
                                            </div>
                                            <div className={`flex-1 ${completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                {text}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Історія за 30 днів</h2>
                        <div className="overflow-x-auto">
                            <div className="inline-flex gap-1 min-w-full">
                                {getPast30Days().map(date => {
                                    const count = history[date] || 0;
                                    const dayOfWeek = new Date(date).getDay();
                                    return (
                                        <div key={date} className="flex flex-col items-center">
                                            <div className="flex flex-col-reverse gap-1 mb-2">
                                                {[...Array(13)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-3 h-3 rounded-sm ${i < count ? getIntensity(count) : 'bg-gray-100'
                                                            }`}
                                                        title={`${date}: ${count}/13`}
                                                    />
                                                ))}
                                            </div>
                                            {dayOfWeek === 1 && (
                                                <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                                                    {new Date(date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-600">
                            <span>Менше</span>
                            <div className="flex gap-1">
                                <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
                                <div className="w-4 h-4 bg-green-200 rounded-sm"></div>
                                <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
                                <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                                <div className="w-4 h-4 bg-green-800 rounded-sm"></div>
                            </div>
                            <span>Більше</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}