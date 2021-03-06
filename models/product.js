const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    contactNumber: {
      type: String,
      trim: true
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

      maxlength: 32,
      trim: true
    },
    email: {
      type: String
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true
    },
    city: {
      type: ObjectId,
      ref: 'City',
      required: true
    },
    stock: {
      type: String
    },
    likes: {
      type: Number,
      default: 0
    },
    dislikes: {
      type: Number,
      default: 0
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
