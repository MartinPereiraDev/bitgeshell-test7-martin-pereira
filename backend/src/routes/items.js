const express = require('express');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const router = express.Router();
const DATA_PATH = path.join(process.cwd(), 'data', 'items.json');
const mock = require('mock-fs');


// Utility to read data (async, non-blocking)
async function readData() {
  try {
    const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    // Si el archivo no existe, lo crea vacío
    if (err.code === 'ENOENT') {
      await fs.promises.writeFile(DATA_PATH, '[]');
      return [];
    }
    throw err;
  }
}


// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit, q } = req.query;
    let results = data;

    if (q) {
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }

    if (limit) {
      results = results.slice(0, parseInt(limit));
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      return next(err);
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Validation schema with Joi
const itemSchema = Joi.object({
  name:     Joi.string().min(3).max(60).required(),
  category: Joi.string().min(3).max(60).required(),
  price:    Joi.number().min(0).required()
});

//const logDebug = (msg, obj) => {
//  require('mock-fs').bypass(() => {
//    fs.appendFileSync('C:\\temp\\debug.log', `${msg}: ${JSON.stringify(obj)}\n`);
//  });
//};

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    
    const { error, value } = itemSchema.validate(req.body);
    if (error) {
      
      return res.status(400).json({ error: error.details[0].message });
    }
    const item = value;
    const data = await readData();
    

    if (data.some(i => i.name.toLowerCase() === item.name.toLowerCase())) {
      
      return res.status(400).json({ error: 'Item name must be unique.' });
    }

    const maxId = data.length > 0 ? Math.max(...data.map(i => i.id)) : 0;
    item.id = maxId + 1;

    data.push(item);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
   
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});
module.exports = router;