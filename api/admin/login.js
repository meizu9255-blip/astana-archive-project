export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin2024';

    if (password === adminPassword) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ error: 'Неверный пароль' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
