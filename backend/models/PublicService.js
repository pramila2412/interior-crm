const mongoose = require('mongoose');

const publicServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: String, // String identifier for the icon
  image: String, // URL for the image
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

publicServiceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('PublicService', publicServiceSchema);
