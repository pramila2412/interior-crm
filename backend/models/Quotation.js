const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  id: String,
  item: String,
  description: String,
  qty: Number,
  rate: Number
}, { _id: false });

const quotationSchema = new mongoose.Schema({
  projectId: String,
  projectName: String,
  customerName: String,
  date: String,
  status: { type: String, default: 'DRAFT' }, // 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED'
  items: [lineItemSchema],
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true });

quotationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('Quotation', quotationSchema);
