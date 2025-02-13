import cl from './Header.module.css'
import News from '../../assets/news.png'
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const navigate = useNavigate();

    const onClick = (link: string) => {
        navigate(`${link}`)
    }

    return (
        <header className={cl.Header}>
            <img src={News} alt="" />
            <div className={cl.Header_buttons}>
                <div onClick={() => onClick('home')}>Все мероприятия</div>
                <div onClick={() => onClick('calendar')}>Календарь мероприятий</div>
                <div >Галерея</div>
            </div>
            <div className={cl.Header_profile_button} onClick={() => onClick('profile')}>
                Профиль
            </div>
        </header>
    )
}