import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { id, fullName, iin, email, phone, type, query, date, status } = req.body;
    try {
      const { rows } = await pool.query(
        `INSERT INTO orders (id, full_name, iin, email, phone, type, query, date, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [id, fullName, iin, email, phone, type, query, date, status]
      );
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  if (req.method === 'GET') {
    const { iin } = req.query;
    if (iin) {
      try {
        const { rows } = await pool.query('SELECT * FROM orders WHERE iin = $1', [iin]);
        return res.status(200).json(rows);
      } catch (err) {
        console.error('Error fetching order by query:', err);
        return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
      }
    }
    return res.status(200).json([]);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
