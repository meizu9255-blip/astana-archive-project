import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// GET /api/funds
app.get('/api/funds', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM funds ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching funds:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
  const { id, fullName, iin, email, phone, type, query, date, status } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO orders (id, full_name, iin, email, phone, type, query, date, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [id, fullName, iin, email, phone, type, query, date, status]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// GET /api/orders (поддержка ?iin=123)
app.get('/api/orders', async (req, res) => {
  const { iin } = req.query;
  if (iin) {
    try {
      const { rows } = await pool.query('SELECT * FROM orders WHERE iin = $1', [iin]);
      return res.json(rows);
    } catch (err) {
      console.error('Error fetching order by query:', err);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }
  res.json([]);
});

export default app;
