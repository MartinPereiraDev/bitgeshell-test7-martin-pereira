const express = require('express');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const router = express.Router();
const DATA_PATH = path.join(process.cwd(), 'data', 'items.json');



// Utility to read data (async, non-blocking)
async function readData() {
  try {
    const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    // if the file does not exist, throw an error
    if (err.code === 'ENOENT') {
      throw new Error('Data file not found');
    }
    throw err;
  }
}


// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    let { page = 1, limit = 10, q, order } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let results = data;

    if (q) {
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }

    // Ordering
    if (order === 'price_asc') {
      results = results.sort((a, b) => a.price - b.price);
    } else if (order === 'price_desc') {
      results = results.sort((a, b) => b.price - a.price);
    }

    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = results.slice(start, end);

    res.json({
      items: paginatedItems,
      total,
      page,
      totalPages,
      limit
    });
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

// Validation schema with Joi for POST 
const itemCreateSchema = Joi.object({
  name:     Joi.string().min(3).max(60).required(),
  category: Joi.string().min(3).max(60).required(),
  price:    Joi.number().min(0).required()
});


// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    
    const { error, value } = itemCreateSchema.validate(req.body);
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

// Validation Schema for Update
const itemUpdateSchema = Joi.object({
  name:     Joi.string().min(3).max(60),
  category: Joi.string().min(3).max(60),
  price:    Joi.number().min(0)
}).min(1);


// PATCH /api/items/:id
router.patch('/:id', async (req, res, next) => {
  try {
    // 1. Leer datos y encontrar el ítem
    const data = await readData();
    console.log('Datos leídos:', data);
    const id = parseInt(req.params.id);
    const itemIndex = data.findIndex(i => i.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // 2. validate fields (using .prefs({ allowUnknown: true }) for security)
    const { error, value } = itemUpdateSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });
    
    if (error) {
      return res.status(400).json({ 
        error: error.details.map(d => d.message).join('; ') 
      });
    }

    // 3. check for duplicates (excluding the current item)
    if (value.name) {
      const isDuplicate = data.some(
        (item, index) => 
          index !== itemIndex && 
          item.name.toLowerCase() === value.name.toLowerCase()
      );
      
      if (isDuplicate) {
        return res.status(400).json({ error: 'Item name must be unique.' });
      }
    }

    // 4. create a copy of the array to avoid direct mutation
    const updatedData = [...data];
    
    // 5. update the item with the new values
    updatedData[itemIndex] = {
      ...updatedData[itemIndex],
      ...value,
      id: updatedData[itemIndex].id // Previene cambios de ID
    };

    // 6. write the file with the new copy

    await fs.promises.writeFile(DATA_PATH, JSON.stringify(updatedData, null, 2));
   
    // 7. Responder con el ítem actualizado
    res.json(updatedData[itemIndex]);
    
  } catch (err) {
    next(err);
  }
});
module.exports = router;