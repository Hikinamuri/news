import { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (userId) {
      axios.get(`http://127.0.0.1:8000/user/${userId}`)
        .then(response => setUser(response.data))
        .catch(error => console.error(error));
    }
  }, [userId]);

  if (!user) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Профиль пользователя</h1>
      <p>ФИО: {user.full_name}</p>
      <p>Дата рождения: {user.date_of_birth}</p>
      <p>Номер телефона: {user.phone_number}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;