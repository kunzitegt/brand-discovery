import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { marca, sector, shape, palette, typo, words, style, tone, refs } = req.body;

  try {
    const auth = new google.auth.GoogleAuth({
    credentials: {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY
    .replace(/\\n/g, '\n'),
},
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Hoja 1!A:J',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toLocaleString('es-GT'),
          marca,
          sector,
          shape,
          palette,
          typo,
          words?.join(', '),
          style,
          tone,
          refs?.join(', '),
        ]],
      },
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}