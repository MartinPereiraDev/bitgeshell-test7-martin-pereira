const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(process.cwd(), 'data', 'items.json');

// --- MEMORY CACHE ---
let cachedStats = null;
let lastModified = null;

// Watch file changes to invalidate cache
fs.watchFile(DATA_PATH, (curr, prev) => {
  if (curr.mtimeMs !== prev.mtimeMs) {
    cachedStats = null;
    lastModified = null;
  }
});

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    // if there is cache, return it
    if (cachedStats) {
      return res.json(cachedStats);
    }
    // read file and calculate stats
    fs.readFile(DATA_PATH, (err, raw) => {
      if (err) return next(err);
      const items = JSON.parse(raw);
      const stats = {
        total: items.length,
        averagePrice: items.length > 0 ? items.reduce((acc, cur) => acc + cur.price, 0) / items.length : 0
      };
      cachedStats = stats;
      res.json(stats);
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;