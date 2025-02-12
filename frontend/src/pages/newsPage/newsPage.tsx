import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './NewsPage.module.css'; // Импортируем стили

interface News {
  id: number;
  title: string;
  description: string;
  date: string;
  link: string;
  category: string;
  ageGroup: string;
  isFree: boolean;
  maxCount: number;
  location: string;
  images: string[];
}

const NewsPage: React.FC = () => {
  const { id } = useParams();
  const [news, setNews] = useState<News | null>(null);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/news/${id}`).then((response) => {
        setNews(response.data);
      }).catch((error) => {
        console.error("Ошибка при получении новости:", error);
      });
    }
  }, [id]);

  if (!news) {
    return <div>Загрузка...</div>;
  }

    return (
        <div className={styles.newsPage}>
            <h2>{news.title}</h2>
            {news.images.length > 0 && (
                <div className={styles.newsImages}>
                    <img src={news.images} alt={`Изображение ${news.id}`} />
                </div>
            )}
            <p><strong>Дата:</strong> {news.date}</p>
            <p><strong>Категория:</strong> {news.category}</p>
            <p><strong>Возрастная группа:</strong> {news.ageGroup}</p>
            <p><strong>Бесплатное:</strong> {news.isFree ? "Да" : "Нет"}</p>
            <p><strong>Местоположение:</strong> {news.location}</p>

            <div
                className={styles.newsDescription}
                dangerouslySetInnerHTML={{ __html: news.description }}
            />
        </div>
    );
};

export default NewsPage;