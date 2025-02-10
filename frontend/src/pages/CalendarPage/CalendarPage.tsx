import { useState } from 'react';
import CalendarHeader from '../../components/Calendar/CalendarHeader';
import CalendarGrid from '../../components/Calendar/CalendarGrid';
import cl from './index.module.css'
import { News } from '../../types/event'

export const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const events: News[] = [
        {
          id: 1,
          title: "Мастер-класс по живописи",
          description: "Учимся рисовать акварелью",
          date: "2025-02-15",
          link: "#",
          category: "cultural",
          ageGroup: "18+",
          isFree: true,
        },
        {
          id: 2,
          title: "Футбольный матч",
          description: "Турнир по футболу",
          date: "2025-02-10",
          link: "#",
          category: "sports",
          ageGroup: "16+",
          isFree: false,
        },
        // Другие мероприятия...
      ];

    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    };

    return (
        <div className={cl.calendar}>
            <CalendarHeader currentDate={currentDate} onPrev={goToPreviousMonth} onNext={goToNextMonth} />
            <CalendarGrid currentDate={currentDate} events={events} />
        </div>
    );
}