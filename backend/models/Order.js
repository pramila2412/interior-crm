const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true },
  projectId: String,
  projectName: String,
  vendor: String,
  date: String,
  amount: Number,
  status: { type: String, default: 'DRAFT' }, // 'DRAFT' | 'ISSUED' | 'DELIVERED' | 'CANCELLED'
  expectedDelivery: String
}, { timestamps: true });

orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('Order', orderSchema);
