import React from 'react';
import styles from './About.module.css';

const About = () => {
  const stack = [
    { name: 'React', role: 'Frontend Framework', icon: '⚛️' },
    { name: 'FastAPI / Node.js', role: 'Backend API', icon: '⚙️' },
    { name: 'PostgreSQL', role: 'Database', icon: '🗄️' },
    { name: 'Axios', role: 'HTTP Client', icon: '📡' },
    { name: 'CSS Modules', role: 'Styling', icon: '🎨' },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>О проекте</h1>
        <p className={styles.subtitle}>
          Современная платформа для управления заказами и онлайн-торговли.
        </p>
      </section>

      <section className={styles.section}>
        <h2>💻 Технологический стек</h2>
        <div className={styles.stackGrid}>
          {stack.map((item, index) => (
            <div key={index} className={styles.stackCard}>
              <span className={styles.icon}>{item.icon}</span>
              <h3>{item.name}</h3>
              <p>{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>🏗️ Как это работает?</h2>
        <div className={styles.workflow}>
          <div className={styles.step}>
            <div className={styles.number}>1</div>
            <div className={styles.stepContent}>
              <h3>Клиентская часть</h3>
              <p>Пользователь взаимодействует с интерфейсом React. Данные хранятся в <code>sessionStorage</code> для авторизации, а запросы отправляются через Axios.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.number}>2</div>
            <div className={styles.stepContent}>
              <h3>Безопасность</h3>
              <p>Доступ к админ-панели и создание заказов защищены с помощью <strong>JWT (JSON Web Tokens)</strong>. Токен передается в заголовке Authorization.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.number}>3</div>
            <div className={styles.stepContent}>
              <h3>Сервер и БД</h3>
              <p>API обрабатывает запросы, проверяет права доступа и сохраняет данные в реляционной базе данных. Все пути к изображениям динамически формируются через ENV.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Ключевой функционал</h2>
        <ul>
          <li>✅ Динамическая витрина товаров со скидками.</li>
          <li>✅ Система оформления заказов с валидацией наличия.</li>
          <li>✅ Админ-панель: управление статусами и удаление записей.</li>
          <li>✅ Адаптивный дизайн и модальные окна.</li>
        </ul>
      </section>
    </div>
  );
};

export default About;