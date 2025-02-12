import { useState } from 'react';
import axios from 'axios';
import styles from './index.module.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post('http://127.0.0.1:8000/login', formData);
            alert(response.data.message);
            if (response.status === 200) {
                navigate('/home')
                localStorage.setItem('user_id', response.data.user_id);
                localStorage.setItem('user_role', response.data.role);
            }
        } catch (error) {
        setError('Неверный email или пароль.');
        console.error(error);
        }
    };

  return (
    <div className={styles.auth}>
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>Авторизация</h3>
            {error && <div className={styles.error}>{error}</div>}
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Войти</button>
            <p>Еще нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
        </form>
    </div>
  );
};

export default LoginForm;