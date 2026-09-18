const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  customerName: String,
  category: String,
  status: { type: String, default: 'Planning' }, // 'Planning' | 'Execution' | 'Review' | 'Completed'
  startDate: String,
  endDate: String,
  budget: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }
}, { timestamps: true });

projectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('Project', projectSchema);
