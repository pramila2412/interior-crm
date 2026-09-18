const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: 'TODO' }, // 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: { type: String, default: 'MEDIUM' }, // 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: String,
  projectId: String,
  projectName: String,
  assigneeName: String
}, { timestamps: true });

taskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('Task', taskSchema);
