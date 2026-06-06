import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function init() {
  try {
    console.log('Создание таблиц...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS funds (
          id SERIAL PRIMARY KEY,
          code VARCHAR(50) NOT NULL,
          period VARCHAR(50) NOT NULL,
          title_ru VARCHAR(255) NOT NULL,
          title_kz VARCHAR(255) NOT NULL,
          category_ru VARCHAR(100) NOT NULL,
          category_kz VARCHAR(100) NOT NULL,
          desc_ru TEXT NOT NULL,
          desc_kz TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(50) PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          iin VARCHAR(12) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          type VARCHAR(255) NOT NULL,
          query TEXT NOT NULL,
          date TIMESTAMP NOT NULL,
          status VARCHAR(50) NOT NULL
      );
    `);
    
    console.log('Очистка старых данных (если есть)...');
    await pool.query('TRUNCATE TABLE funds RESTART IDENTITY');
    
    console.log('Заполнение таблицы funds...');
    await pool.query(`
      INSERT INTO funds (code, period, title_ru, title_kz, category_ru, category_kz, desc_ru, desc_kz) VALUES
      ('Ф. 1', '1917-1991', 'Акмолинский уездный исполнительный комитет', 'Ақмола уездік атқару комитеті', 'Советский период', 'Кеңестік кезең', 'Документы по управлению Акмолинским уездом.', 'Ақмола уезін басқару жөніндегі құжаттар.'),
      ('Ф. 15', '1862-1917', 'Акмолинское городское управление', 'Ақмола қалалық басқармасы', 'Дореволюционный период', 'Төңкеріске дейінгі кезең', 'Документы дореволюционного управления.', 'Төңкеріске дейінгі басқару құжаттары.'),
      ('Ф. 45', '1998-2020', 'Акимат района Есиль города Астаны', 'Астана қаласы Есіл ауданының әкімдігі', 'Современный период', 'Қазіргі кезең', 'Документы о развитии нового района.', 'Жаңа ауданның дамуы туралы құжаттар.')
    `);

    console.log('База данных успешно инициализирована!');
  } catch (err) {
    console.error('Ошибка инициализации:', err);
  } finally {
    await pool.end();
  }
}

init();
