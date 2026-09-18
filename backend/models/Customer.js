const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  address: String,
  service: String,
  category: String,
  status: { type: String, default: 'Enquiry' }, // 'Enquiry' | 'Measurement' | 'Production' | 'Delivery & Installation'
  dateAdded: String
}, { timestamps: true });

// Convert _id to id for frontend compatibility
customerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Customer', customerSchema);
