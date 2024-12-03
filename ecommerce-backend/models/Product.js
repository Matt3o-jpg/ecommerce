const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner', 
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  
});
module.exports = mongoose.model('Product', productSchema);