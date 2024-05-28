// backend/routes/items.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/authMiddleware');

// Rota protegida para obter itens
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Outras rotas também devem ser protegidas
router.post('/', auth, async (req, res) => {
  // ...
});

module.exports = router;
