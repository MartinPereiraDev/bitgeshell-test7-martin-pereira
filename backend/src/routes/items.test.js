const request = require('supertest');
const { notFound } = require('../middleware/errorHandler');
const mock = require('mock-fs');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');

let app;

beforeEach(() => {
  jest.resetModules();
  mock({
    'data/items.json': JSON.stringify([
      { name: 'Item 1', category: 'Category 1', price: 10, id: 1 }
    ]),
    [__dirname]: mock.load(__dirname),
    [path.resolve(__dirname, '../middleware')]: mock.load(path.resolve(__dirname, '../middleware')),
    'node_modules': mock.load(path.resolve(__dirname, '../../node_modules')),
  });
  const itemsRouter = require('./items');
  const express = require('express');
  app = express();
  app.use(express.json());
  app.use('/api/items', itemsRouter);
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route Not Found' });
  });
  const { notFound } = require('../middleware/errorHandler');
  app.use(notFound);
});

afterEach(() => {
  mock.restore();
});

describe('Items API', () => {
  it('GET /api/items should return an array', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it('POST /api/items should create an item', async () => {
  const newItem = { name: 'Test Item', category: 'Test Category', price: 100 };
  const res = await request(app).post('/api/items').send(newItem);

  // error if the test fails
  if (res.statusCode !== 201) {
    console.error('POST ERROR:', res.body);
  }

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body.name).toBe('Test Item');
  expect(res.body.category).toBe('Test Category');
  expect(res.body.price).toBe(100);

  // check if the item was added to the simulated file
  const items = JSON.parse(fs.readFileSync('data/items.json', 'utf-8'));
  const created = items.find(i => i.name === 'Test Item');
  expect(created).toBeDefined();
  expect(created.category).toBe('Test Category');
});

  it('POST /api/items should fail with duplicate name', async () => {
  const duplicate = { name: 'Item 1', category: 'Any', price: 50 };
  const res = await request(app).post('/api/items').send(duplicate);
  expect(res.statusCode).toBe(400);
  
});

  it('GET /api/items/:id with invalid id should return 404', async () => {
    const res = await request(app).get('/api/items/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Item not found');
  });

  it('GET /api/unknown should return 404', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Route Not Found');
  });
});

const itemCreateSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().min(0).required()
});

