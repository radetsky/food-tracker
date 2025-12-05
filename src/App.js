import React, { useState, useEffect } from 'react';

const FOOD_CATEGORIES = [
    {
        id: 0,
        name: "Складні вуглеводи (порція 1)",
        items: ["Бобові 50г", "Картопля 180г", "Кукурудза свіжа 180г", "Пластівці 50г", "Булгур 50г", "Гречка 50г", "Рис (не шліфований) 50г", "Будь-яка крупа 50г", "Цільнозернове борошно 50г", "Хлібці 80г", "Цільнозерновий хліб 85г", "Макарони т.с. 50г", "Лаваш 80г"]
    },
    {
        id: 1,
        name: "Складні вуглеводи (порція 2)",
        items: ["Бобові 50г", "Картопля 180г", "Кукурудза свіжа 180г", "Пластівці 50г", "Булгур 50г", "Гречка 50г", "Рис (не шліфований) 50г", "Будь-яка крупа 50г", "Цільнозернове борошно 50г", "Хлібці 80г", "Цільнозерновий хліб 85г", "Макарони т.с. 50г", "Лаваш 80г"]
    },
    {
        id: 2,
        name: "Овочі та гриби (порція 1)",
        items: ["Овочі свіжі 300г", "Овочі квашені 300г", "Зелень 300г", "Гриби 300г"]
    },
    {
        id: 3,
        name: "Овочі та гриби (порція 2)",
        items: ["Овочі свіжі 300г", "Овочі квашені 300г", "Зелень 300г", "Гриби 300г"]
    },
    {
        id: 4,
        name: "Білок (порція 1)",
        items: ["Телятина 160г", "Печінка 160г", "Куряче філе 190г", "Індиче філе 190г", "Риба (до 5% жиру) 185г", "Риба (від 5% жиру) 125г", "3 яйця", "Морепродукти 220г"]
    },
    {
        id: 5,
        name: "Білок (порція 2)",
        items: ["Телятина 160г", "Печінка 160г", "Куряче філе 190г", "Індиче філе 190г", "Риба (до 5% жиру) 185г", "Риба (від 5% жиру) 125г", "3 яйця", "Морепродукти 220г"]
    },
    {
        id: 6,
        name: "Смаколики або фрукти",
        items: ["Смаколики 55г", "Фрукти 550г", "Калорійні фрукти (банани, виноград, хурма, манго) 200г"]
    },
    {
        id: 7,
        name: "Молочні продукти (порція 1)",
        items: ["Сир зернистий (творог) 5% 160г", "Сири м'які/тверді/плавлені 55г", "Сметана 15% 110г", "Масло 27г", "Сало 19г", "Кефір 2.5% 360г", "Несолодкий йогурт 1.6% 370г"]
    },
    {
        id: 8,
        name: "Горіхи або насіння",
        items: ["3 грецьких горіха", "Горіхи 20г", "Насіння 20г"]
    },
    {
        id: 9,
        name: "Фрукти та ягоди",
        items: ["Фрукти та ягоди 300г", "Банани/виноград/хурма/манго 180г"]
    },
    {
        id: 10,
        name: "Молочні продукти (порція 2)",
        items: ["Несолодкий йогурт 1.5-2.5% 200г"]
    },
    {
        id: 11,
        name: "Жири (порція 1)",
        items: ["Олія 12г", "Авокадо 65г", "Оливки 80г", "Гірчиця 28г", "Майонез 15г", "Кетчуп 42г"]
    },
    {
        id: 12,
        name: "Жири (порція 2)",
        items: ["Олія 12г", "Авокадо 65г", "Оливки 80г", "Гірчиця 28г", "Майонез 15г", "Кетчуп 42г"]
    }
];

export default function FoodTracker() {
    const [completed, setCompleted] = useState({});
    const [expanded, setExpanded] = useState(null);
    const [history, setHistory] = useState({});
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('today');
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const loadData = () => {
            try {
                const todayData = localStorage.getItem(`food-${today}`);
                if (todayData) {
                    setCompleted(JSON.parse(todayData));
                }

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
            localStorage.setItem(`food-${today}`, JSON.stringify(newCompleted));

            const completedCount = Object.keys(newCompleted).filter(key =>
                newCompleted[key] && newCompleted[key].length > 0
            ).length;

            const newHistory = { ...history, [today]: completedCount };
            localStorage.setItem('food-history', JSON.stringify(newHistory));
            setHistory(newHistory);
        } catch (error) {
            console.error('Помилка збереження:', error);
        }
    };

    const toggleCategory = (categoryId) => {
        setExpanded(expanded === categoryId ? null : categoryId);
    };

    const toggleItem = (categoryId, itemName) => {
        const categoryItems = Array.isArray(completed[categoryId]) ? completed[categoryId] : [];
        const newCategoryItems = categoryItems.includes(itemName)
            ? categoryItems.filter(i => i !== itemName)
            : [...categoryItems, itemName];

        const newCompleted = {
            ...completed,
            [categoryId]: newCategoryItems
        };

        setCompleted(newCompleted);
        saveData(newCompleted);
    };

    const isCategoryCompleted = (categoryId) => {
        const items = completed[categoryId];
        return Array.isArray(items) && items.length > 0;
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

    const sortedCategories = [...FOOD_CATEGORIES].sort((a, b) => {
        const aCompleted = isCategoryCompleted(a.id) ? 1 : 0;
        const bCompleted = isCategoryCompleted(b.id) ? 1 : 0;

        // Спочатку невиконані, потім виконані
        if (aCompleted !== bCompleted) {
            return aCompleted - bCompleted;
        }

        // Якщо обидва виконані або невиконані - зберігаємо оригінальний порядок
        return a.id - b.id;
    });

    const totalCompleted = Object.keys(completed).filter(key =>
        completed[key] && completed[key].length > 0
    ).length;
    const allCompleted = totalCompleted === FOOD_CATEGORIES.length;

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
                            {totalCompleted} / {FOOD_CATEGORIES.length}
                        </div>
                        <div className="text-sm text-gray-600">категорій виконано</div>
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
                                {sortedCategories.map((category) => {
                                    const isCompleted = isCategoryCompleted(category.id);
                                    const isExpanded = expanded === category.id;
                                    const selectedItems = Array.isArray(completed[category.id]) ? completed[category.id] : [];

                                    return (
                                        <div
                                            key={category.id}
                                            className={`rounded-lg border-2 transition-all ${isCompleted
                                                    ? 'bg-green-50 border-green-300 opacity-60'
                                                    : 'bg-white border-gray-200'
                                                }`}
                                        >
                                            <div
                                                onClick={() => toggleCategory(category.id)}
                                                className="p-4 cursor-pointer hover:bg-gray-50"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center ${isCompleted
                                                                ? 'bg-green-600 border-green-600'
                                                                : 'border-gray-300'
                                                            }`}>
                                                            {isCompleted && <span className="text-white text-sm">✓</span>}
                                                        </div>
                                                        <div className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                            {category.name}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {selectedItems.length > 0 && (
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                                {selectedItems.length} обрано
                                                            </span>
                                                        )}
                                                        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                                            ▼
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="px-4 pb-4 space-y-2 border-t border-gray-200 pt-3">
                                                    {category.items.map((item, idx) => {
                                                        const isSelected = selectedItems.includes(item);
                                                        return (
                                                            <div
                                                                key={idx}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleItem(category.id, item);
                                                                }}
                                                                className={`p-3 rounded-md cursor-pointer transition-all ${isSelected
                                                                        ? 'bg-green-100 border-2 border-green-400'
                                                                        : 'bg-gray-50 border-2 border-transparent hover:border-green-200'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected
                                                                            ? 'bg-green-600 border-green-600'
                                                                            : 'border-gray-400'
                                                                        }`}>
                                                                        {isSelected && <span className="text-white text-xs">✓</span>}
                                                                    </div>
                                                                    <span className={`text-sm ${isSelected ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
                                                                        {item}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
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