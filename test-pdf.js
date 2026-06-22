import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

async function test() {
  try {
    const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/Roboto-Regular.ttf';
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    
    const customFont = await pdfDoc.embedFont(fontBytes);
    console.log("Success");
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
