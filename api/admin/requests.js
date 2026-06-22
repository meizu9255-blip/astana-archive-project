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

  // GET /api/admin/requests
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT *, document_url FROM orders ORDER BY date DESC');
      return res.status(200).json(rows);
    } catch (err) {
      console.error('Error fetching all orders for admin:', err);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  // PATCH /api/admin/requests
  // Note: Standard Vercel Serverless doesn't use Express routing like /:id
  // We can pass `id` in the body or query params. Here we use body.
  if (req.method === 'PATCH' || req.method === 'PUT') {
    const { id, status, document_url } = req.body;
    
    if (!id || !status) {
      return res.status(400).json({ error: 'Missing id or status' });
    }

    const validStatuses = ['Заявка принята', 'В обработке', 'Готово к выдаче', 'Отклонено'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
      const { rows } = await pool.query(
        'UPDATE orders SET status = $1, document_url = COALESCE($2, document_url) WHERE id = $3 RETURNING *',
        [status, document_url || null, id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Заявка не найдена' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Error updating order status:', err);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
