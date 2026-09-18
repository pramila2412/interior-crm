const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  projectId: String,
  projectName: String,
  customerName: String,
  type: { type: String, default: 'ADVANCE' }, // 'ADVANCE' | 'FINAL'
  amount: { type: Number, default: 0 },
  dueDate: String,
  status: { type: String, default: 'PENDING' } // 'PENDING' | 'COMPLETED' | 'OVERDUE'
}, { timestamps: true });

paymentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('Payment', paymentSchema);
