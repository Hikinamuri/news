import cl from './Home.module.css'

import { useEffect, useState } from 'react'
// import Calendar from "react-calendar";
import DOMPurify from "dompurify";

import { News } from '../../types/event'


export const Home = () => {
    const userRole = localStorage.getItem('user_role');
    const [nearestEvents, setNearestEvents] = useState<News[]>([])
    const [importantEvents, setImportantEvents] = useState<News[]>([])
    const [aboutCompanies, setAboutCompanies] = useState<News[]>([])

    const [allNews, setAllNews] = useState<News[]>([]);

    const [filteredEvents, setFilteredEvents] = useState(allNews);

    const [searchQuery, setSearchQuery] = useState("");

    // const [calendarView, setCalendarView] = useState('month');
    const [filter, setFilter] = useState({
        category: '',
        ageGroup: '',
        isFree: null
    });
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState<Partial<News>>({
        title: "",
        description: "",
        date: "",
        // link: "",
        category: "",
        ageGroup: "",
        isFree: false,
        maxCount: 0,
        location: "",
        images: [],
        news_type: ''
    });
    const [imageFile, setImageFile] = useState<string>();

    const handleAddEvent = () => {
        setShowForm(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
    
            reader.onloadend = () => {
                const base64String = reader.result as string; // Base64 string
                console.log(base64String); // You can now send this to your API or use it as needed
                setImageFile(base64String); // Store Base64 string in state for later use
            };
    
            reader.readAsDataURL(file); // Converts the file to Base64
        }
    };    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!newEvent.title || !newEvent.description || !newEvent.date) {
            alert("Пожалуйста, заполните все обязательные поля.");
            return;
        }
    
        const requestBody = {
            title: newEvent.title,
            description: newEvent.description,
            date: newEvent.date,
            // link: newEvent.link,
            category: newEvent.category,
            ageGroup: newEvent.ageGroup,
            isFree: newEvent.isFree,
            maxCount: newEvent.maxCount,
            location: newEvent.location,
            images: imageFile ? [imageFile] : [],
            news_type: newEvent.news_type
        };
    
        try {
            const response = await fetch("http://localhost:8000/news", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Set content type to JSON
                },
                body: JSON.stringify(requestBody), // Convert the data to a JSON string
            });
    
            if (!response.ok) {
                throw new Error("Ошибка при создании события.");
            }
    
            const result = await response.json();
            console.log("Новость успешно добавлена:", result);
    
            setShowForm(false);
            setNewEvent({
                title: "",
                description: "",
                date: "",
                // link: "",
                category: "",
                ageGroup: "",
                isFree: false,
                maxCount: 0,
                location: "",
                images: []
            });
    
            setNearestEvents(prev => [...prev, result]);
    
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };
    
    
    
    const handleFilterChange = (filterType: string, value: string | boolean | null) => {
        setFilter(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const getFilteredEvents = () => {
        return allNews.filter(event => {
            let matches = true;

            if (filter.category && event.category !== filter.category) {
                matches = false;
            }

            if (filter.ageGroup && event.ageGroup !== filter.ageGroup) {
                matches = false;
            }

            if (filter.isFree !== null && event.isFree !== filter.isFree) {
                matches = false;
            }

            return matches;
        }).filter(event => {
            if (searchQuery) {
                console.log(allNews)
                return event.title.toLowerCase().includes(searchQuery) ||
                       event.description.toLowerCase().includes(searchQuery);
            }
            return true;
        });
    };
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    };

    useEffect(() => {
        console.log(getFilteredEvents())
        setFilteredEvents(getFilteredEvents());
    }, [searchQuery, filter]);

    // const handleCalendarChange = (date: Date) => {
    //     // Здесь можно добавить логику для фильтрации событий по дате
    // };

    const fetchNews = async () => {
        try {
            const response = await fetch("http://localhost:8000/news/");
            if (response.ok) {
                const data = await response.json();
                setNearestEvents(data.filter((event: any) => event.news_type === "nearest"));
                setImportantEvents(data.filter((event: any) => event.news_type === "important"));
                setAboutCompanies(data.filter((event: any) => event.news_type === "about"));
            } else {
                throw new Error("Ошибка при получении новостей.");
            }
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [showForm]);

    useEffect(() => {
        const allNews = [...nearestEvents, ...importantEvents, ...aboutCompanies]
        setAllNews(allNews);
    }, [nearestEvents, importantEvents, aboutCompanies]);


    return (
        <div className={cl.Home}>
            <div className={cl.SearchWrapper}>
                <input
                    className={cl.SearchInput}
                    type="search"
                    placeholder="Введите ключевые слова:"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <span className={cl.SearchIcon}>&#128269;</span>
            </div>
            <div className={cl.Filters}>
                <div>
                    <label>Категория:</label>
                    <select onChange={(e) => handleFilterChange('category', e.target.value)}>
                        <option value="">Все</option>
                        <option value="sports">Спортивные</option>
                        <option value="cultural">Культурные</option>
                        <option value="educational">Образовательные</option>
                    </select>
                </div>
                <div>
                    <label>Возрастная группа:</label>
                    <select onChange={(e) => handleFilterChange('ageGroup', e.target.value)}>
                        <option value="">Все</option>
                        <option value="children">Дети</option>
                        <option value="teenagers">Подростки</option>
                        <option value="adults">Взрослые</option>
                    </select>
                </div>
                <div>
                    <label>Доступность:</label>
                    <select onChange={(e) => handleFilterChange('isFree', e.target.value === 'true')}>
                        <option value="">Все</option>
                        <option value="true">Бесплатные</option>
                        <option value="false">Платные</option>
                    </select>
                </div>
                {userRole === "admin" && (
                    <button onClick={handleAddEvent} className={cl.AddEventButton}>
                        Добавить событие
                    </button>
                )}
            </div>
            
            <div className={cl.links}>
                <p><a href="#nearest-events">Ближайшие</a></p>
                <p><a href="#important-events">Важные</a></p>
                <p><a href="#about-companies">О компаниях</a></p>
            </div>
            
            {/* <div className={cl.Calendar}>
                <Calendar 
                    onChange={handleCalendarChange} 
                    view={calendarView} 
                    onViewChange={({ view }) => setCalendarView(view)} 
                />
            </div> */}
            {showForm && (
                <div className={cl.Modal}>
                    <div className={cl.ModalContent}>
                        <h2>Добавить новое событие</h2>
                        <form onSubmit={handleSubmit}>
                            <label>Название:</label>
                            <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} required />

                            <label>Описание:</label>
                            <textarea name="description" value={newEvent.description} onChange={handleInputChange} required />

                            <label>Тип:</label>
                            <select name="news_type" value={newEvent.news_type} onChange={handleInputChange} required>
                                <option value="">Выберите тип</option>
                                <option value="nearest">Ближайшие</option>
                                <option value="important">Важные</option>
                                <option value="about">О компании</option>
                            </select>

                            <label>Дата:</label>
                            <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} required />

                            {/* <label>Ссылка:</label>
                            <input type="text" name="link" value={newEvent.link} onChange={handleInputChange} required/> */}

                            <label>Категория:</label>
                            <select name="category" value={newEvent.category} onChange={handleInputChange} required>
                                <option value="">Выберите категорию</option>
                                <option value="sports">Спортивные</option>
                                <option value="cultural">Культурные</option>
                                <option value="educational">Образовательные</option>
                            </select>

                            <label>Возрастная группа:</label>
                            <select name="ageGroup" value={newEvent.ageGroup} onChange={handleInputChange} required>
                                <option value="">Выберите возрастную группу</option>
                                <option value="children">Дети</option>
                                <option value="teenagers">Подростки</option>
                                <option value="adults">Взрослые</option>
                            </select>

                            <label>Бесплатное событие:</label>
                            <select name="isFree" value={String(newEvent.isFree)} onChange={handleInputChange} required>
                                <option value="true">Да</option>
                                <option value="false">Нет</option>
                            </select>

                            <label>Максимальное количество участников:</label>
                            <input
                                type="number"
                                name="maxCount"
                                value={newEvent.maxCount}
                                onChange={handleInputChange}
                                min="0" // Запрещаем ввод отрицательных чисел
                                onKeyPress={(e) => {
                                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                        e.preventDefault();
                                    }
                                }}
                            />

                            <label>Местоположение:</label>
                            <input type="text" name="location" value={newEvent.location} onChange={handleInputChange} />

                            <label>Изображение:</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} />

                            <button type="submit">Создать</button>
                            <button type="button" onClick={() => setShowForm(false)}>Отмена</button>
                        </form>
                    </div>
                </div>
            )}
            <div className={cl.Events}>
                {
                    searchQuery || filter && ( filter.ageGroup || filter.category || filter.isFree ) ? (
                        <div id="nearest-events" className={cl.nearestEvents}>
                            <h2>Вот что нашлось:</h2>
                            <div className={cl.news}>
                                {filteredEvents.map((event) => (
                                    <div key={event.id} className={cl.news_card}>
                                        <div className={cl.news_img}>
                                            <img src={event.images} alt="" />
                                        </div>
                                        <div className={cl.news_desc}>
                                            <h3>{event.title}</h3>
                                            <div 
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}
                                                className={cl.news_description}
                                            />
                                            <p>{event.date}</p>
                                            <a href={`/home/${event.id}`}>Подробнее</a>
                                        </div>
                                    </div>
                                ))}

                                {filteredEvents.length === 0 && (
                                    <p className={cl.noResults}>Ничего не найдено</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div id="nearest-events" className={cl.nearestEvents}>
                                <h2>Ближайшие мероприятия</h2>
                                <div className={cl.news}>
                                    {nearestEvents.map((news, idx) => (
                                        <div key={idx} className={cl.news_card}>
                                            <div className={cl.news_img}>
                                                <img src={news.images} alt="" />
                                            </div>
                                            <div className={cl.news_desc}>
                                                <h3>{news.title}</h3>
                                                <div 
                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.description) }}
                                                    className={cl.news_description}
                                                />
                                                <p>{news.date}</p>
                                                <a href={`/home/${news.id}`}>Подробнее</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div id="important-events" className={cl.nearestEvents}>
                                <h2>Самые важные мероприятия</h2>
                                <div className={cl.news}>
                                    {importantEvents.map((news, idx) => (
                                        <div key={idx} className={cl.news_card}>
                                            <div className={cl.news_img}>
                                                <img src={news.images} alt="" />
                                            </div>
                                            <div className={cl.news_desc}>
                                                <h3>{news.title}</h3>
                                                <div 
                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.description) }}
                                                    className={cl.news_description}
                                                />
                                                <p>{news.date}</p>
                                                <a href={`/home/${news.id}`}>Подробнее</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div id="about-companies" className={cl.nearestEvents}>
                                <h2>Новости о компаниях</h2>
                                <div className={cl.news}>
                                    {aboutCompanies.map((news, idx) => (
                                        <div key={idx} className={cl.news_card}>
                                            <div className={cl.news_img}>
                                                <img src={news.images} alt="" />
                                            </div>
                                            <div className={cl.news_desc}>
                                                <h3>{news.title}</h3>
                                                <div 
                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.description) }}
                                                    className={cl.news_description}
                                                />
                                                <p>{news.date}</p>
                                                <a href={`/home/${news.id}`}>Подробнее</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}