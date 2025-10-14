// models/Hospital.js
const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: 'India' },
      pincode: { type: String, required: true }
    },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] }
    },
    specialties: [{
      type: String,
      enum: ['Cardiology', 'Neurology', 'Dermatology', 'Oncology', 'Pediatrics', 'Gynaecology', 'Orthopaedics', 'Psychology', 'Nephrology', 'Endocrinology', 'Ophthalmology']
    }],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // adds createdAt, updatedAt
  }
);

module.exports = mongoose.model('Hospital', hospitalSchema);