const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  diseaseCategory: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 30,
    trim: true
  },
  diseaseSubCategory: {
    type: String,
    minLength: 5,
    maxLength: 30,
    trim: true
  },
  diseaseName: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 30,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true
  },
  seriousness: {
    type: String,
    enum: {
      values: ['Normal', 'Critical'],
      message: '{VALUE} is not a valid seriousness level'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Disease', diseaseSchema);