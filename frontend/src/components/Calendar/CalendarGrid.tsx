import React, { useState } from 'react';
import cl from './index.module.css';
import { News } from '../../types/event'; // Импортируем интерфейс News

interface CalendarGridProps {
  currentDate: Date;
  events: News[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events }) => {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  // Функция для получения цвета категории мероприятия
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cultural':
        return '#ffcc00'; // Желтый для культурных мероприятий
      case 'sports':
        return '#00cc66'; // Зеленый для спортивных мероприятий
      case 'educational':
        return '#3366ff'; // Синий для образовательных мероприятий
      default:
        return '#cccccc'; // Серый по умолчанию
    }
  };

  const getInitials = (text: string) => {
    return text
      .split(' ') // Разделяем текст на слова
      .map(word => word[0]) // Берем первую букву каждого слова
      .join('') // Объединяем буквы в строку
      .toUpperCase(); // Переводим в верхний регистр
  };
  // Функция для отображения мероприятий в ячейке дня
  const renderEvents = (date: string) => {
    const dayEvents = events.filter(event => event.date === date);
    return dayEvents.map(event => (
      <div
        key={event.id}
        className={cl.event}
        style={{ backgroundColor: getCategoryColor(event.category) }}
      >
        {getInitials(event.title)}
      </div>
    ));
  };

  // Рендер дней для месячного вида
  const renderMonthView = () => {
    const days = [];
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Корректировка для начала недели с понедельника

    // Пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty_${i}`} className={`${cl.calendar_day} ${cl.empty}`}></div>);
    }

    // Ячейки с днями текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push(
        <div key={`day_${i}`} className={cl.calendar_day}>
          <div className={cl.day_number}>{i}</div>
          {renderEvents(date)}
        </div>
      );
    }

    return days;
  };

  // Рендер дней для недельного вида
  const renderWeekView = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Начало недели (понедельник)

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      days.push(
        <div key={`day_${i}`} className={cl.calendar_day}>
          <div className={cl.day_number}>{date.getDate()}</div>
          {renderEvents(formattedDate)}
        </div>
      );
    }

    return days;
  };

  // Рендер для дневного вида
  const renderDayView = () => {
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    return (
      <div className={cl.calendar_day}>
        <div className={cl.day_number}>{currentDate.getDate()}</div>
        {renderEvents(formattedDate)}
      </div>
    );
  };

  return (
    <div>
      <div className={cl.view_controls}>
        <button onClick={() => setView('month')}>Месяц</button>
        <button onClick={() => setView('week')}>Неделя</button>
        <button onClick={() => setView('day')}>День</button>
      </div>
      <div className={cl.calendar_grid}>
        {view === 'month' && (
          <>
            {daysOfWeek.map(day => (
              <div key={day} className={cl.calendar_day_header}>{day}</div>
            ))}
            {renderMonthView()}
          </>
        )}
        {view === 'week' && (
          <>
            {daysOfWeek.map(day => (
              <div key={day} className={cl.calendar_day_header}>{day}</div>
            ))}
            {renderWeekView()}
          </>
        )}
        {view === 'day' && renderDayView()}
      </div>
    </div>
  );
};

export default CalendarGrid;