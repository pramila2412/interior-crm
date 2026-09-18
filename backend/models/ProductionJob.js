const mongoose = require('mongoose');

const productionJobSchema = new mongoose.Schema({
  jobName: { type: String, required: true },
  projectId: String,
  projectName: String,
  customerName: String,
  stage: { type: String, default: 'PROCUREMENT' }, // 'PROCUREMENT' | 'MEASUREMENT' | 'TAILORING' | 'READY'
  priority: { type: String, default: 'Normal' },
  startDate: String,
  deadline: String,
  assignedTo: String
}, { timestamps: true });

productionJobSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('ProductionJob', productionJobSchema);
