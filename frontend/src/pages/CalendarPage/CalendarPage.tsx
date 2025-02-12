import { useEffect, useState } from 'react';
import CalendarHeader from '../../components/Calendar/CalendarHeader';
import CalendarGrid from '../../components/Calendar/CalendarGrid';
import cl from './index.module.css'
import { News } from '../../types/event'

export const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [news, setNews] = useState<News[]>([]);

    const fetchNews = async () => {
      try {
          const response = await fetch("http://localhost:8000/news/");
          if (response.ok) {
              const data = await response.json();
              setNews(data);
          } else {
              throw new Error("Ошибка при получении новостей.");
          }
      } catch (error) {
          console.error("Ошибка загрузки данных:", error);
      }
  };

    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className={cl.calendar}>
            <CalendarHeader currentDate={currentDate} onPrev={goToPreviousMonth} onNext={goToNextMonth} />
            <CalendarGrid currentDate={currentDate} events={news} />
        </div>
    );
}