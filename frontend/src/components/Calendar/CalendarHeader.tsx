import cl from './index.module.css'

const CalendarHeader: React.FC<{ currentDate: Date, onPrev: () => void, onNext: () => void }> = ({ currentDate, onPrev, onNext }) => {
  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  return (
    <div className={cl.calendar_header}>
      <button onClick={onPrev}>&lt;</button>
      <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
      <button onClick={onNext}>&gt;</button>
    </div>
  );
};

export default CalendarHeader;