//Packages are imported to use in this module
const mongoose = require('mongoose');

//Declared schema
const patientShema = mongoose.Schema({
        name: {
                type: String,
                required: true
        },
        age: {
                type: Number,
                required: true,
                min: 3,
                max: 90
        },
        mobile: {
                type: Number,
                required: true,
                unique: true
        },
        email: {
                type: String,
                required: true,
                unique: true
        },
        address: {
                type: String,
                required: true
        },
        diseaseCategory: {
                type: String,
                required: true,
                min: 5,
                max: 30
        },
        diseaseSubCategory: {
                type: String,min:5, max: 30
        },
        diseaseName: {
                type: String,
                required: true,min:5, max: 30
        },
        status: {
                type: String,
                enum: ['Pending', 'Scheduled'],
                default: 'Pending'
        }
}, {timestamps: true});

//Exporting the mongoose model for future use
module.exports = mongoose.model('Patient', patientShema);