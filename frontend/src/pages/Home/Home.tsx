import cl from './Home.module.css'

import { useEffect, useState } from 'react'
// import Calendar from "react-calendar";
import DOMPurify from "dompurify";

import { News } from '../../types/event'


export const Home = () => {

    const [nearestEvents, setNearestEvents] = useState<News[]>([])
    const [importantEvents, setImportantEvents] = useState<News[]>([])
    const [aboutCompanies, setAboutCompanies] = useState<News[]>([])

    const allNews = [...nearestEvents, ...importantEvents, ...aboutCompanies];

    const [filteredEvents, setFilteredEvents] = useState(allNews);

    const [searchQuery, setSearchQuery] = useState("");

    // const [calendarView, setCalendarView] = useState('month');
    const [filter, setFilter] = useState({
        category: '',
        ageGroup: '',
        isFree: null
    });

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

    useEffect(() => {
        setNearestEvents(
            [
                {
                    id: 1,
                    title: "Молодежный центр \"Хыял\"",
                    description: `
                        <p>Желаем всем хорошей недели и отличного настроения!</p>
                        <p>На этой неделе много классных мероприятий:</p>
                        <ul>
                            <li>14 января — Игры на свежем воздухе "Зимние забавы".</li>
                            <li>МБОУ "Мало-Лызитская СОШ".</li>
                        </ul>
                    `,
                    date: "22 января 17:00",
                    link: "#",
                    category: "cultural",
                    ageGroup: "children",
                    isFree: true
                },
                {
                    id: 2,
                    title: "Центр досуга \"Север\"",
                    description: `
                        <p>Приглашаем на серию мастер-классов:</p>
                        <ul>
                            <li>15 января — Гончарное искусство.</li>
                            <li>16 января — Рисование акварелью.</li>
                        </ul>
                    `,
                    date: "15-16 января 15:00",
                    link: "#",
                    category: "sports",
                    ageGroup: "teenagers",
                    isFree: true
                },
                {
                    id: 3,
                    title: "Библиотека №5",
                    description: `
                        <p>Присоединяйтесь к обсуждению любимых книг!</p>
                        <p>Клуб читателей собирается каждую пятницу.</p>
                    `,
                    date: "19 января 18:00",
                    link: "#",
                    category: "educational",
                    ageGroup: "teenagers",
                    isFree: true
                },
                {
                    id: 4,
                    title: "Дом культуры \"Юбилейный\"",
                    description: `
                        <p>В субботу пройдет вечер ретро-танцев!</p>
                        <p>Приходите танцевать под любимые хиты 80-х и 90-х.</p>
                        <ul>
                            <li>Дата: 20 января</li>
                            <li>Время: 18:00</li>
                        </ul>
                    `,
                    date: "20 января 18:00",
                    link: "#",
                    category: "cultural",
                    ageGroup: "adults",
                    isFree: true
                },
                {
                    id: 5,
                    title: "Выставочный зал \"Галерея\"",
                    description: `
                        <p>Открытие новой выставки «Искусство природы».</p>
                        <p>Выставка включает более 50 работ современных художников.</p>
                        <ul>
                            <li>21 января — день открытия, вход свободный!</li>
                        </ul>
                    `,
                    date: "21 января 12:00",
                    link: "#",
                    category: "sports",
                    ageGroup: "children",
                    isFree: true
                },
                {
                    id: 6,
                    title: "Спортивный центр \"Олимп\"",
                    description: `
                        <p>Соревнования по настольному теннису для всех возрастов.</p>
                        <p>Регистрируйтесь заранее для участия!</p>
                        <ul>
                            <li>Дата: 22 января</li>
                            <li>Время: 14:00</li>
                        </ul>
                    `,
                    date: "22 января 14:00",
                    link: "#",
                    category: "educational",
                    ageGroup: "children",
                    isFree: true
                }
            ]
        );        
        setImportantEvents([
            {
                id: 7,
                title: 'Национальный форум молодёжи',
                description: 'Форум для обмена опытом среди молодых лидеров. Выступят известные спикеры.',
                date: '25 января 10:00',
                link: '#',
                category: 'educational',
                ageGroup: 'adults',
                isFree: true
            },
            {
                id: 8,
                title: 'Всероссийский конкурс "Зимняя фантазия"',
                description: 'Финал конкурса рисунков и поделок. Победителей ждут призы!',
                date: '22 января 14:00',
                link: '#',
                category: 'educational',
                ageGroup: 'teenagers',
                isFree: true
            },
            {
                id: 9,
                title: 'Конференция "Будущее технологий"',
                description: 'Обсуждение новых технологий с участием ведущих специалистов.',
                date: '19 января 13:00',
                link: '#',
                category: 'educational',
                ageGroup: 'adults',
                isFree: true
            },
            {
                id: 10,
                title: 'Молодежный конкурс "Самые красивые рисунки"',
                description: 'Соревнование по созданию красивых рисунков. Победителей ждут призы!',
                date: '15 января 12:00',
                link: '#',
                category: 'educational',
                ageGroup: 'children',
                isFree: false
            },
            {
                id: 11,
                title: 'Конкурс "Самые умные дети"',
                description: 'Соревнование по развитию умств и души. Победителей ждут призы!',
                date: '12 января 11:00',
                link: '#',
                category: 'educational',
                ageGroup: 'children',
                isFree: false
            }
        ]);
        setAboutCompanies([
            {
                id: 12,
                title: "Библиотека №5",
                description: `
                    <p>Присоединяйтесь к обсуждению любимых книг!</p>
                    <p>Клуб читателей собирается каждую пятницу.</p>
                `,
                date: "19 января 18:00",
                link: "#",
                category: "cultural",
                ageGroup: "adults",
                isFree: false
            },
            {
                id: 13,
                title: "Центр досуга \"Север\"",
                description: `
                    <p>Приглашаем на серию мастер-классов:</p>
                    <ul>
                        <li>15 января — Гончарное искусство.</li>
                        <li>16 января — Рисование акварелью.</li>
                    </ul>
                `,
                date: "15-16 января 15:00",
                link: "#",
                category: "cultural",
                ageGroup: "teenagers",
                isFree: false
            },
            {
                id: 14,
                title: "Библиотека №5",
                description: `
                    <p>Присоединяйтесь к обсуждению любимых книг!</p>
                    <p>Клуб читателей собирается каждую пятницу.</p>
                `,
                date: "19 января 18:00",
                link: "#",
                category: "cultural",
                ageGroup: "adults",
                isFree: false
            }
        ])
    }, [])


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
            <div className={cl.Events}>
                {
                    searchQuery || filter && ( filter.ageGroup || filter.category || filter.isFree ) ? (
                        <div id="nearest-events" className={cl.nearestEvents}>
                            <h2>Вот что нашлось:</h2>
                            <div className={cl.news}>
                                {filteredEvents.map((event) => (
                                    <div key={event.id} className={cl.news_card}>
                                        <h3>{event.title}</h3>
                                        <div 
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}
                                            className={cl.news_description}
                                        />
                                        <p>{event.date}</p>
                                        <a href={event.link}>Подробнее</a>
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
                                            <h3>{news.title}</h3>
                                            <div 
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.description) }}
                                                className={cl.news_description}
                                            />
                                            <p>{news.date}</p>
                                            <a href={news.link}>Подробнее</a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div id="important-events" className={cl.nearestEvents}>
                                <h2>Самые важные мероприятия</h2>
                                <div className={cl.news}>
                                    {importantEvents.map((news, idx) => (
                                        <div key={idx} className={cl.news_card}>
                                            <h3>{news.title}</h3>
                                            <div 
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.description) }}
                                                className={cl.news_description}
                                            />
                                            <p>{news.date}</p>
                                            <a href={news.link}>Подробнее</a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div id="about-companies" className={cl.nearestEvents}>
                                <h2>Новости о компаниях</h2>
                                <div className={cl.news}>
                                    {aboutCompanies.map((news, idx) => (
                                        <div key={idx} className={cl.news_card}>
                                            <h3>{news.title}</h3>
                                            <div 
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.description) }}
                                                className={cl.news_description}
                                            />
                                            <p>{news.date}</p>
                                            <a href={news.link}>Подробнее</a>
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