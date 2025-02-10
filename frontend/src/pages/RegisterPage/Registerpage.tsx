import { useState } from 'react';
import axios from 'axios';
import styles from './index.module.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
        const response = await axios.post('http://127.0.0.1:8000/register', {
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            email: formData.email,
            password: formData.password,
            date_of_birth: formData.dateOfBirth,
        });
      alert(response.data.message);
    } catch (error) {
      setError('Ошибка при регистрации. Проверьте введенные данные.');
      console.error(error);
    }
  };

  return (
    <div className={styles.register}>
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            <h3>Регистрация</h3>
            <input
                type="text"
                name="fullName"
                placeholder="ФИО"
                value={formData.fullName}
                onChange={handleChange}
                required
            />
            <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="phoneNumber"
                placeholder="Номер телефона"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
            />
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
            <button type="submit">Зарегистрироваться</button>
            <p>Уже есть аккаунт? <a href="/auth">Войти</a></p>
        </form>
    </div>
  );
};

export default RegisterForm;