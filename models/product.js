const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    user: {
      type: ObjectId,
      ref: 'User'
    },
    companyName: {
      type: String,
      trim: true
    },
    searchIndex: {
      type: String
    },
    description: {
      type: String,
      trim: true,
      default: 'No description available for this product',
      maxlength: 2000
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
      trim: true
    },
    city: {
      type: ObjectId,
      ref: 'City',
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    photos: [
      {
        type: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
