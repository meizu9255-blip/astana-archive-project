import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('Очистка таблицы orders...');
    await pool.query('TRUNCATE TABLE orders RESTART IDENTITY');
    
    console.log('Вставка тестовых данных...');
    await pool.query(`
      INSERT INTO orders (id, full_name, iin, email, phone, type, query, date, status) VALUES
      ('REQ-001', 'Оспанов Арман Серікұлы', '900512300123', 'arman.ospanov@mail.kz', '+77010001122', 'Архивная справка', 'Прошу выдать справку о подтверждении стажа работы.', NOW(), 'В обработке'),
      ('REQ-002', 'Смағұлова Әйгерім Маратқызы', '980805450111', 'aigerim.smagulova@gmail.com', '+77020002233', 'Копия документа', 'Запрос копии решения акимата за 1999 год.', NOW() - INTERVAL '1 day', 'Готово к выдаче'),
      ('REQ-003', 'Иванов Дмитрий Сергеевич', '851122300456', 'd.ivanov@yandex.kz', '+77050003344', 'Генеалогический запрос', 'Поиск информации о родственниках.', NOW() - INTERVAL '2 days', 'Заявка принята'),
      ('REQ-004', 'Ким Елена Владимировна', '951212450333', 'elena_kim95@gmail.com', '+77070004455', 'Архивная справка', 'Справка о рождении.', NOW(), 'В обработке'),
      ('REQ-005', 'Құдайбергенов Мақсат Талғатұлы', '880417300444', 'maksat_kudaybergenov@mail.ru', '+77080005566', 'Выписка из решения', 'Выписка по земельному участку.', NOW() - INTERVAL '5 days', 'Готово к выдаче'),
      ('REQ-006', 'Исаева Динара Болатқызы', '910909450555', 'd.isaeva@yahoo.com', '+77010006677', 'Архивная справка', 'Справка о переименовании улицы.', NOW(), 'Заявка принята'),
      ('REQ-007', 'Ахметов Руслан Жандосұлы', '820130300222', 'ruslan.akhmetov@icloud.com', '+77020007788', 'Копия документа', 'Копия архивного дела №45.', NOW() - INTERVAL '3 days', 'В обработке'),
      ('REQ-008', 'Серікбай Азамат Нұрланұлы', '930214300789', 'azamat.serikbay@gmail.com', '+77050008899', 'Тематический запрос', 'Сведения о строительстве школы.', NOW() - INTERVAL '10 days', 'Готово к выдаче'),
      ('REQ-009', 'Төлеуов Бауыржан Ерланұлы', '870707300666', 'b.toleuov@mail.kz', '+77070009900', 'Архивная справка', 'Подтверждение награждения.', NOW() - INTERVAL '1 hour', 'Заявка принята'),
      ('REQ-010', 'Петров Александр Николаевич', '990321300777', 'petrov.alex@yandex.ru', '+77080001122', 'Генеалогический запрос', 'Исследование родословной.', NOW(), 'В обработке');
    `);
    
    console.log('Данные успешно обновлены!');
  } catch (err) {
    console.error('Ошибка:', err);
  } finally {
    await pool.end();
  }
}

run();
