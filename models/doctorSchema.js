const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3, // ✅ Use 'minlength', not 'min'
      maxlength: 30, // ✅ Use 'maxlength', not 'max'
    },
    image: {
      type: String,
    },
    medicalSpecialist: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 30,
    },
    experience: {
      type: Number,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?[0-9\s\-()]+$/, "Invalid phone number format"],
      minlength: 10,
      maxlength: 15,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
