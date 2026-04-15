const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const store = {}; // In-memory store (Temporary on Vercel)

// Create a shareable link
app.post('/share', (req, res) => {
  const { scene, msg, to } = req.body;
  if (!scene) return res.status(400).json({ error: 'Missing scene' });
  
  const id = randomBytes(6).toString('base64url');
  store[id] = { scene, msg, to };
  
  res.json({ 
    id, 
    url: `${req.protocol}://${req.get('host')}/share/${id}` 
  });
});

// Retrieve shared content
app.get('/share/:id', (req, res) => {
  const data = store[req.params.id];
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

module.exports = app;
