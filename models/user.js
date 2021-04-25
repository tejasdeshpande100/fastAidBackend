var mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
const { ObjectId } = mongoose.Schema;

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 32,
      trim: true,
      default: null
    },
    companyName: {
      type: String,
      trim: true,
      default: null
    },
    phoneNumber: {
      type: Number,
      trim: true,
      index: {
        sparse: true,
        unique: true
      },
      default: null
    },
    seller: {
      type: Number,
      trim: true,
      default: 0
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true
    },
    city: {
      type: ObjectId,
      ref: 'City'
    },
    email: {
      type: String,
      trim: true,
      index: {
        sparse: true,
        unique: true,
        partialFilterExpression: { email: { $type: 'string' } }
      }
    },
    contactinfo: {
      type: String,
      trim: true,
      default: null
    },
    encry_password: {
      type: String,
      default: null
    },
    salt: String,
    role: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  autheticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return '';
    try {
      return crypto.createHmac('sha256', this.salt).update(plainpassword).digest('hex');
    } catch (err) {
      return '';
    }
  }
};

module.exports = mongoose.model('User', userSchema);
