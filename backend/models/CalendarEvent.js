const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  type: { type: String, default: 'meeting' }, // 'meeting', 'installation', 'measurement', 'deadline'
  projectId: String,
  customerId: String
}, { timestamps: true });

calendarEventSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
