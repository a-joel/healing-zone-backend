//Packages are imported to use in this module
const express = require('express');
const router = express.Router();

//External files
const Doctor = require('../models/doctorSchema');
const { default: mongoose } = require('mongoose');

//Routes are declared here
router.get('/', async (req, res) => {

        try {
                const doctors = await Doctor.find();
                return res.status(200).json({data: doctors});
                
        } catch (error) {
                console.log(error);
                return res.status(500).json({message: error.message});
                
        }
});

// Endpoint for posting data
router.post('/', async (req, res) => {
  try {

    const doctor = await Doctor.create(req.body);

    console.log("Created doctor:", doctor);

    return res.status(201).json({ 
      data: doctor 
    });
  } catch (error) {
    console.error("Error creating doctor:", error);

    // ✅ Return user-friendly error without exposing internals
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: error.errors
        }
      });
    }

    // For other errors (e.g., DB connection)
    return res.status(500).json({
      error: {
        message: "Server error. Could not create doctor."
      }
    });
  }
});

//Update doctor end point
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const doctorDataToUpdate = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Patient ID" });
}

const updatedDoctor = await Doctor.findByIdAndUpdate(id, doctorDataToUpdate, {new: true, runValidators: true});

if (!updatedDoctor) {
  return res.status(400).json({message: "Data not updated something error."});
}

console.log(updatedDoctor);
return res.status(200).json({message: "Doctor updated", data: updatedDoctor});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: error.message});
  }
});

//Delete route for doctor
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({message: "Document not found to delete."});
    }

    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDocter) {
      return res.status(400).json({message: "Not deleted."});
    }

    console.log("Doctor deleted.");
    return res.status(204).json({message: "Doctor data deleted."});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: error.message});
  }
});

//Exporting the router module
module.exports = router;