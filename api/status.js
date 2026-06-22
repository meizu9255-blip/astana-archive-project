import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter' });
    }

    try {
      // Use ILIKE for case-insensitive matching
      const { rows } = await pool.query(
        'SELECT id, date, status, document_url FROM orders WHERE id ILIKE $1',
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Заявка не найдена' });
      }
      
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Error fetching order status:', err);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
