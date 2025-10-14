// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    // Patient details (from your form)
    name: { type: String, required: true },
    age: { type: Number, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    address: { type: String, required: true },

    // Medical info
    diseaseCategory: { type: String, required: true },
    diseaseSubCategory: { type: String },
    diseaseName: { type: String, required: true },

    // Payment & status
    paymentId: { type: String, required: true, unique: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'confirmed'
    },
    amount: { type: Number, default: 500 }, // in paise (₹5.00)

    // Link to user (from authenticate middleware)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // assuming your user model is 'User'
      required: true
    },

    // Optional: doctor, date, etc. (add later if needed)
  },
  {
    timestamps: true // adds createdAt, updatedAt
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);