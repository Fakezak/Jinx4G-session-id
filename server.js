const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In‑memory storage
const pairCodes = {};
const sessionIds = {};

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Generate pair code
app.post('/generate-pair-code', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.json({ error: 'Phone number required' });
  }

  const pairCode = Math.floor(10000000 + Math.random() * 90000000).toString();
  pairCodes[phoneNumber] = pairCode;

  try {
    await client.sendMessage(
      phoneNumber,
      `🌀 *Jinx4G Pair Code*\n\nYour code: *${pairCode}*\n\nEnter this on the website to receive your session ID.`
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ error: 'Failed to send WhatsApp message' });
  }
});

// Verify pair code → send session ID
app.post('/verify-pair-code', async (req, res) => {
  const { phoneNumber, pairCode } = req.body;

  if (pairCodes[phoneNumber] !== pairCode) {
    return res.json({ error: 'Invalid pair code' });
  }

  const sessionId = crypto.randomBytes(20).toString('hex');
  sessionIds[sessionId] = phoneNumber;
  delete pairCodes[phoneNumber];

  await client.sendMessage(
    phoneNumber,
    `✅ *Jinx4G Session ID*\n\n\`${sessionId}\`\n\nKeep this safe.`
  );

  res.json({ success: true });
});

// WhatsApp events
client.on('qr', qr => {
  console.log('Scan QR Code:', qr);
});

client.on('ready', () => {
  console.log('✅ Jinx4G WhatsApp Bot Ready');
});

client.initialize();

// Start server
app.listen(3000, () => {
  console.log('🌐 Jinx4G Server running on http://localhost:3000');
});
