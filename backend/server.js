require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Models
const Customer = require('./models/Customer');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Quotation = require('./models/Quotation');
const Order = require('./models/Order');
const ProductionJob = require('./models/ProductionJob');
const Installation = require('./models/Installation');
const InventoryItem = require('./models/InventoryItem');
const Payment = require('./models/Payment');
const PublicService = require('./models/PublicService');
const CalendarEvent = require('./models/CalendarEvent');

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.error('CRITICAL: MONGODB_URI environment variable is missing!');
}

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('Interior CRM API is running!');
});

// Generic Routes Factory
const createRoutes = (Model, path) => {
  // GET all
  app.get(path, async (req, res) => {
    try {
      const items = await Model.find().sort({ createdAt: -1 });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET by id
  app.get(`${path}/:id`, async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST create
  app.post(path, async (req, res) => {
    try {
      const newItem = new Model(req.body);
      const saved = await newItem.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PUT update
  app.put(`${path}/:id`, async (req, res) => {
    try {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PATCH partial update
  app.patch(`${path}/:id`, async (req, res) => {
    try {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETE
  app.delete(`${path}/:id`, async (req, res) => {
    try {
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Register Routes
createRoutes(Customer, '/api/customers');
createRoutes(User, '/api/users');
createRoutes(Project, '/api/projects');
createRoutes(Task, '/api/tasks');
createRoutes(Quotation, '/api/quotations');
createRoutes(Order, '/api/orders');
createRoutes(ProductionJob, '/api/production');
createRoutes(Installation, '/api/installations');
createRoutes(InventoryItem, '/api/inventory');
createRoutes(Payment, '/api/payments');
createRoutes(PublicService, '/api/public-services');
createRoutes(CalendarEvent, '/api/calendar');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
