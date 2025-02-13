import { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import axios from 'axios';

interface User {
  id: number;
  FIO: string;
  registration_date: string;
  role: string;
  email: string;
}

const Profile = () => {
  const user_id = localStorage.getItem('user_id');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
        axios.get(`http://127.0.0.1:8000/user/${user_id}`)
            .then(response => setUser(response.data))
            .catch(error => console.error(error));
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    console.log('user')
  }, [user_id]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.profileContainer}>
      {user && (
        <div className={styles.profile}>
          <h2>Профиль пользователя</h2>
          <p><strong>ФИО:</strong> {user.FIO}</p>
          <p><strong>Дата регистрации:</strong> {new Date(user.registration_date).toLocaleDateString()}</p>
          <p><strong>Роль:</strong> {user.role}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
