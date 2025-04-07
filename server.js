const express = require('express');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));

function generarHashPersonalizado(longitud = 128) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*()#$%^&@!+=-_~';
  let resultado = '';
  for (let i = 0; i < longitud; i++) {
    const randomIndex = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres[randomIndex];
  }
  return resultado;
}

app.get('/generate', async (req, res) => {
  const now = new Date();
  now.setHours(now.getHours() - 5); // Ajuste manual UTC-7

  const hora = now.toISOString().split('.')[0]; // "YYYY-MM-DDTHH:mm:ss"
  const hash = generarHashPersonalizado(128);

  const payload = {
    puerta: 'ADEX',
    hora: hora,
    hash: hash
  };

  try {
    const qr = await QRCode.toDataURL(JSON.stringify(payload));
    res.json({ qr, payload }); // Devuelvo payload también por si deseas mostrarlo
  } catch (err) {
    res.status(500).send('Error generando QR');
  }
});

app.listen(port, () => {
  console.log(`Servidor QR activo en http://localhost:${port}`);
});
