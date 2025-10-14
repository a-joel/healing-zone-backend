// Packages are imported to use in this module
const express = require('express');
const router = express.Router();

// External files
const Disease = require('../models/diseaseShema');
const { default: mongoose } = require('mongoose');

// Endpoint for getting all diseases (GET /)
router.get('/', async (req, res) => {
  try {
    const diseases = await Disease.find();
    console.log(diseases);
    return res.status(200).json({ data: diseases });
  } catch (error) {
    console.error(error); // ✅ Use console.error for errors
    return res.status(500).json({ message: error.message });
  }
});

//Endpoint for inserting 
router.post('/', async (req, res) => {
  try {
    const disease = await Disease.create(req.body);
    console.log(disease);
    return res.status(201).json({data: disease});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: error.message});
    
  }
});

//Update the disease data
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const requestToUpdateData = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message: "Not a object id"})      
    }

    if (!requestToUpdateData) {
      return res.status(400).json({message: "No content"})
    }

    const updatedDisease = await Disease.findByIdAndUpdate(id, requestToUpdateData, { new: true, runValidators: true });

    if (!updatedDisease) {
      return res.status(400).json({message: "Not updated."});
    }

    console.log(updatedDisease);
    return res.status(200).json({message: "Dieases updated succesfully.", data: updatedDisease});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: error.message});
    
  }
});

//Delete route
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Disease ID format" });
    }

    // Attempt to delete the disease document
    const deletedDisease = await Disease.findByIdAndDelete(id);

    // If no document was found/deleted
    if (!deletedDisease) {
      return res.status(404).json({ message: "Disease not found" });
    }

    console.log(`Disease deleted: ${deletedDisease.diseaseName}`);
    return res.status(200).json({ message: "Disease deleted successfully." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// Exporting the router module
module.exports = router;