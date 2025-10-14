//Packages are imported to use in this module
const mongoose = require('mongoose');

//Declared schema
const userShema = mongoose.Schema({
        name: {
                type: String,
                required: true
        },
        email: {
                type: String,
                required: true,
                unique: true
        },
        password: {
                type: String,
                required: true
        },
        termsAndConditions: {
                type: Boolean
        },
        role: {
                type: String,
                enum: ['doctor', 'patient', 'admin'],
                default: 'patient'
        }
}, { timestamps: true });

//Exporting the mongoose model for future use
module.exports = mongoose.model('User', userShema);