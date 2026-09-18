const mongoose = require('mongoose');

const installationSchema = new mongoose.Schema({
  projectId: String,
  projectName: String,
  customerName: String,
  scheduledDate: String,
  timeSlot: String,
  address: String,
  teamLead: String,
  status: { type: String, default: 'SCHEDULED' }, // 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'RESCHEDULED'
  notes: String
}, { timestamps: true });

installationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('Installation', installationSchema);
