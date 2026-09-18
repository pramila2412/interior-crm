const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'FABRIC' }, // 'FABRIC' | 'HARDWARE' | 'ACCESSORY'
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 0 },
  unit: String
}, { timestamps: true });

inventoryItemSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
