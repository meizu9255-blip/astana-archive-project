import pkg from 'pg';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { put } from '@vercel/blob';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, adminText } = req.body;

  if (!id || !adminText) {
    return res.status(400).json({ error: 'Missing id or adminText' });
  }

  try {
    // 1. Fetch order details
    const { rows } = await pool.query('SELECT full_name FROM orders WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }
    const order = rows[0];

    // 2. Fetch Tinos font (Times New Roman equivalent) for Cyrillic support
    const fontUrl = 'https://raw.githubusercontent.com/google/fonts/master/ofl/tinos/Tinos-Regular.ttf';
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());

    const boldFontUrl = 'https://raw.githubusercontent.com/google/fonts/master/ofl/tinos/Tinos-Bold.ttf';
    const boldFontBytes = await fetch(boldFontUrl).then(res => res.arrayBuffer());

    // 3. Generate PDF
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit.default || fontkit);
    
    const customFont = await pdfDoc.embedFont(Buffer.from(fontBytes));
    const customFontBold = await pdfDoc.embedFont(Buffer.from(boldFontBytes));
    
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    let y = height - 50;
    
    // Header
    const headerText1 = "ҚАЗАҚСТАН РЕСПУБЛИКАСЫ АСТАНА ҚАЛАСЫНЫҢ МЕМЛЕКЕТТІК АРХИВІ";
    const headerText2 = "ГОСУДАРСТВЕННЫЙ АРХИВ ГОРОДА АСТАНЫ";
    
    const headerWidth1 = customFontBold.widthOfTextAtSize(headerText1, 14);
    page.drawText(headerText1, { x: (width - headerWidth1) / 2, y, size: 14, font: customFontBold, color: rgb(0, 0, 0) });
    y -= 20;
    const headerWidth2 = customFontBold.widthOfTextAtSize(headerText2, 14);
    page.drawText(headerText2, { x: (width - headerWidth2) / 2, y, size: 14, font: customFontBold, color: rgb(0, 0, 0) });
    
    y -= 50;

    // Date & Request ID
    const today = new Date().toLocaleDateString('ru-RU');
    page.drawText(`Дата / Күні: ${today}`, { x: 50, y, size: 14, font: customFont });
    page.drawText(`Исх. № / Шығыс №: ${id}`, { x: 50, y: y - 20, size: 14, font: customFont });
    
    // To
    page.drawText(`Кому / Кімге: ${order.full_name}`, { x: 350, y: y - 20, size: 14, font: customFont });

    y -= 80;

    // Title
    const titleText1 = "МҰРАҒАТТЫҚ АНЫҚТАМА";
    const titleText2 = "АРХИВНАЯ СПРАВКА";
    const titleWidth1 = customFontBold.widthOfTextAtSize(titleText1, 18);
    page.drawText(titleText1, { x: (width - titleWidth1) / 2, y, size: 18, font: customFontBold });
    y -= 25;
    const titleWidth2 = customFontBold.widthOfTextAtSize(titleText2, 18);
    page.drawText(titleText2, { x: (width - titleWidth2) / 2, y, size: 18, font: customFontBold });

    y -= 40;

    // Body (Wrap text)
    const maxWidth = width - 100;
    const lines = adminText.split('\n');
    let bodyY = y;
    
    for (const line of lines) {
      const words = line.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = customFont.widthOfTextAtSize(testLine, 14);
        if (testWidth > maxWidth && currentLine !== '') {
          page.drawText(currentLine, { x: 50, y: bodyY, size: 14, font: customFont });
          currentLine = word;
          bodyY -= 20; // Increased line height for 14pt text
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        page.drawText(currentLine, { x: 50, y: bodyY, size: 14, font: customFont });
        bodyY -= 20;
      }
    }

    // Footer
    bodyY -= 60;
    page.drawText("Архив директоры / Директор архива", { x: 50, y: bodyY, size: 14, font: customFontBold });
    page.drawText("________________________", { x: 350, y: bodyY, size: 14, font: customFont });

    const pdfBytes = await pdfDoc.save();

    // 4. Upload to Vercel Blob
    const filename = `certificate_${id}.pdf`;
    const blob = await put(filename, Buffer.from(pdfBytes), {
      access: 'public',
      contentType: 'application/pdf'
    });

    // 5. Update Database
    await pool.query(
      'UPDATE orders SET status = $1, document_url = $2 WHERE id = $3',
      ['Готово к выдаче', blob.url, id]
    );

    return res.status(200).json({ url: blob.url });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ error: 'Failed to generate PDF', details: error.message, stack: error.stack });
  }
}
