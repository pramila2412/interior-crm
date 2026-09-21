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
      const oldDoc = await Model.findById(req.params.id);
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });

      // BUSINESS LOGIC PIPELINE
      if (path === '/api/quotations' && oldDoc.status !== 'ACCEPTED' && updated.status === 'ACCEPTED') {
        // Automatically create a Draft Purchase Order
        const Order = require('./models/Order');
        await Order.create({
          poNumber: `PO-${Date.now().toString().slice(-6)}`,
          projectId: updated.projectId,
          projectName: updated.projectName,
          vendor: 'Pending Assignment',
          date: new Date().toISOString().split('T')[0],
          amount: updated.total * 0.4, // Estimate 40% material cost
          status: 'DRAFT',
          expectedDelivery: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0]
        });
      }

      if (path === '/api/orders' && oldDoc.status !== 'ISSUED' && updated.status === 'ISSUED') {
        // Automatically push to Production
        const ProductionJob = require('./models/ProductionJob');
        const existingJob = await ProductionJob.findOne({ projectId: updated.projectId });
        if (!existingJob) {
          await ProductionJob.create({
            jobName: `${updated.projectName} Fabrication`,
            projectId: updated.projectId,
            projectName: updated.projectName,
            customerName: updated.customerName || 'Unknown Customer',
            stage: 'PROCUREMENT',
            priority: 'High',
            startDate: new Date().toISOString().split('T')[0],
            deadline: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0]
          });
        }
      }

      if (path === '/api/production' && oldDoc.stage !== 'READY' && updated.stage === 'READY') {
        // Automatically push to Installation Calendar
        const CalendarEvent = require('./models/CalendarEvent');
        const Installation = require('./models/Installation');
        
        await Installation.create({
          projectId: updated.projectId,
          projectName: updated.projectName,
          customerName: updated.customerName,
          status: 'SCHEDULED',
          scheduledDate: new Date(Date.now() + 2*24*60*60*1000).toISOString().split('T')[0],
          completedDate: '',
          assignedTeam: 'Unassigned',
          notes: 'Auto-generated from Production completion.'
        });

        await CalendarEvent.create({
          title: `Installation: ${updated.projectName}`,
          description: `Automatically scheduled installation for ${updated.customerName}`,
          date: new Date(Date.now() + 2*24*60*60*1000).toISOString(),
          type: 'installation',
          projectId: updated.projectId,
          customerId: ''
        });
      }

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
